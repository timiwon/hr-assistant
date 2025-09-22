import type { Filter } from "@/types/repositories";
import type {
    CandidateProcessing,
    CandidateProcessingWithCandidate,
    Job,
    JobProcessStep,
    JobProcessStepWithCandidateProcessings,
    Organization
} from "@/types/entities";

export interface IJobService {
    getCount(
        filters: Filter[]
    ): Promise<number | null>;
    getList(
        filters: Filter[],
        page: number,
        perPage: number
    ): Promise<Job[]>;
    getJobWithSteps(
        jobId: string
    ): Promise<{
        job: Job,
        steps: JobProcessStepWithCandidateProcessings[]
    }>;
    createJobWithDefaultData(
        data: {
            organization: Omit<Organization, "id" | "created_at" | "updated_at" | "owner_id">,
            job: Omit<Job, "id" | "created_at" | "updated_at" | "owner_id">
        },
    ): Promise<Job>;
    updateJob (
        jobId: string,
        data: Partial<Job>
    ): Promise<Job>;
}

export interface IProcessingService {
    create (
        stepId: string,
        candidateId: string,
        candidateProcessingData: {
            status: "processing" | "done" | "failed";
            note: string | null;
            due_date: string | null;
            sort_order: number;
        }
    ): Promise<CandidateProcessingWithCandidate>;
    move(
        updatedData: CandidateProcessing[]
    ): void;
}

export interface IStepService {
    create (
        jobId: string,
        title: string,
        description: string,
        newOrder: number
    ): Promise<JobProcessStep>;
    update (
        stepId: string,
        title: string,
        description: string
    ): Promise<JobProcessStep>
}