import type { 
    Client,
    Job,
    JobProcessStep,
} from "@/types/models";

import { OrganizationRepository } from "@/lib/repositories/organizationRepository";
import { OrganizationProcessStepRepository } from "@/lib/repositories/organizationProcessStepRepository";
import { JobRepository } from "@/lib/repositories/jobRepository";
import { JobProcessStepRepository } from "@/lib/repositories/jobProcessStepRepository";

export class JobService {
    private jobRepo: JobRepository;
    private jobProcessStepRepo: JobProcessStepRepository;
    private organizationProcessStepRepo: OrganizationProcessStepRepository;
    private organizationRepo: OrganizationRepository;

    constructor(client: Client) {
        this.jobRepo = new JobRepository(client);
        this.organizationProcessStepRepo = new OrganizationProcessStepRepository(client);
        this.organizationRepo = new OrganizationRepository(client);
        this.jobProcessStepRepo = new JobProcessStepRepository(client);
    }

    async getList(page: number, perPage: number): Promise<{ data: Job[], count: number | null }> {
        try {
            const { data, count } = await this.jobRepo.getList(page, perPage);
            return { data, count };
        } catch (err) {
            throw err;
        }
    }

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
            const organization = await this.organizationRepo.create(
                {
                    ...data.organization
                }
            );

            const job = await this.jobRepo.create(
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
                this.organizationProcessStepRepo.create(
                    {
                        ...item,
                        organization_id: organization.id
                    }
                )
            ));

            // create job process steps
            await Promise.all(defaultProcessSteps.map(item => 
                this.jobProcessStepRepo.create(
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
}
