import type { 
    Organization,
    Job,
    JobProcessStep,
    JobProcessStepWithCandidateProcessings,
} from "@/types/entities";
import type {
    Filter,
    ICandidateProcessingRepository,
    IJobProcessStepRepository,
    IJobRepository,
    IOrganizationProcessStepRepository,
    IOrganizationRepository,
} from "@/types/repositories";
import type { IJobService } from "@/types/services";
import type {
    Client
} from "@/providers/DBClientProvider";

import { FactoryRepository } from "@/lib/repositories/factoryRepository";

export class JobService implements IJobService {
    private jobRepo: IJobRepository;
    private jobProcessStepRepo: IJobProcessStepRepository;
    private organizationProcessStepRepo: IOrganizationProcessStepRepository;
    private organizationRepo: IOrganizationRepository;
    private candidateProcessRepo: ICandidateProcessingRepository;

    constructor(client: Client) {
        const factory = new FactoryRepository(client);
        this.jobRepo = factory.createJob();
        this.organizationProcessStepRepo = factory.createOrganizationProcessStep();
        this.organizationRepo = factory.createOrganization();
        this.jobProcessStepRepo = factory.createJobProcessStep();
        this.candidateProcessRepo = factory.createCandidateProcessing();
    }

    async getCount(filters: Filter[]): Promise<number | null> {
        try {
            return await this.jobRepo.getCount(filters);
        } catch (err) {
            throw err;
        }
    }

    async getList(filters: Filter[], page: number, perPage: number): Promise<Job[]> {
        try {
            return await this.jobRepo.getList(filters, page, perPage);
        } catch (err) {
            throw err;
        }
    }

    async getJobWithSteps(jobId: string): Promise<{
        job: Job,
        steps: JobProcessStepWithCandidateProcessings[]
    }> {
        try {
            const stepFilters: Filter[] = [{
                column: 'job_id',
                operation: 'eq',
                value: jobId
            }, {
                column: 'sort_order',
                operation: 'order',
                value: {
                    ascending: true
                }
            }];
            const [job, steps, processings] = await Promise.all([
                this.jobRepo.findById(jobId),
                this.jobProcessStepRepo.getList(stepFilters, 1, 100),
                this.candidateProcessRepo.getListByJobId(jobId)
            ]);

            const stepsWithProcessing = steps.map((step) => ({
                ...step,
                candidate_processings: processings.filter((processing) => processing.job_process_step_id === step.id)
            }));

            if (!job) {
                throw new Error("Job not found");
            }

            return {
                job,
                steps: stepsWithProcessing
            };
        } catch (err) {
            throw err;
        }
    }

    async createJobWithDefaultData(
        data: {
            organization: Omit<Organization, "id" | "created_at" | "updated_at" | "owner_id">,
            job: Omit<Job, "id" | "created_at" | "updated_at" | "owner_id">
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

    async updateJob (jobId: string, data: Partial<Job>): Promise<Job> {
        try {
            const job = await this.jobRepo.update(jobId, {...data});
            return job;
        } catch (err) {
            throw err;
        }
    }
}
