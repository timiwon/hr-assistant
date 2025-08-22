import type { 
    Client,
    Job,
    JobProcessStep,
} from "@/types/models";

import { organizationRepository } from "@/lib/repositories/organizationRepository";
import { organizationProcessStepRepository } from "@/lib/repositories/organizationProcessStepRepository";
import { jobRepository } from "@/lib/repositories/jobRepository";
import { jobProcessStepRepository } from "@/lib/repositories/jobProcessStepRepository";

export const jobService = (client: Client) => {
    const organizationProcessStepRepo = organizationProcessStepRepository(client);
    const organizationRepo = organizationRepository(client);
    const jobRepo = jobRepository(client);
    const jobProcessStepRepo = jobProcessStepRepository(client);

    return {
        async getList(page: number, perPage: number): Promise<Job[]> {
            try {
                const data = await jobRepo.getList(page, perPage);
                return data;
            } catch (err) {
                throw err;
            }
        },

        async createJobWithDefaultData(
            data: {
                organization: {
                    name: string,
                    description: string | null,
                },
                job: {
                    title: string,
                    description: string | null,
                    priority: "low" | "medium" | "high",
                    candidate_amount: number
                },
            },
        ): Promise<Job> {
            // TODO: need a transaction excute
            try {
                const organization = await organizationRepo.create(
                    {
                        ...data.organization
                    }
                );

                const job = await jobRepo.createJob(
                    {
                        ...data.job,
                        status: "open",
                        organization_id: organization.id,
                        domain_id: "1"
                    }
                );

                const defaultProcessSteps: Omit<
                    JobProcessStep,
                    "id" |
                    "created_at" |
                    "updated_at" |
                    "job_id">[] = [{
                    title: "Review",
                    description: "",
                    sort_order: 0
                }, {
                    title: "HR Interview",
                    description: "",
                    sort_order: 1
                }, {
                    title: "Tech Interview",
                    description: "",
                    sort_order: 2
                }];

                // create organization process steps
                await Promise.all(defaultProcessSteps.map(item => 
                    organizationProcessStepRepo.create(
                        {
                            ...item,
                            organization_id: organization.id
                        }
                    )
                ));

                // create job process steps
                await Promise.all(defaultProcessSteps.map(item => 
                    jobProcessStepRepo.create(
                        {
                            ...item,
                            job_id: job.id
                        }
                    )
                ));

                return job;
            } catch (err) {
                throw err;
            }
        }
    };
};