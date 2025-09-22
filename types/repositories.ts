import {
    Candidate,
    CandidateProcessing,
    CandidateProcessingWithCandidate,
    Job,
    JobProcessStep,
    Organization,
    OrganizationProcessStep,
} from "@/types/entities";

export type Filter = {
    column: string,
    operation: string,
    value: unknown
}

export interface IBaseRepository<T> {
    setSelect: (select: string) => this;
    getCount: (filters: Filter[]) => Promise<number | null>;
    findById: (id: string) => Promise<T>;
    getList: (filters: Filter[], page: number, perPage: number) => Promise<T[]>;
    create: (params: Omit<T, "id" | "created_at" | "updated_at" | "owner_id">) => Promise<T>;
    update: (
        id: string,
        updates: Partial<T>
    ) => Promise<T>;
}

export interface IJobRepository extends IBaseRepository<Job> {}

export interface ICandidateRepository extends IBaseRepository<Candidate> {}

export interface ICandidateProcessingRepository extends IBaseRepository<CandidateProcessing> {
    getListByJobId(jobId: string): Promise<CandidateProcessingWithCandidate[]>;
    getSpecificWithCandidate(stepId: string, candidateId: string): Promise<CandidateProcessingWithCandidate>;
    bulkUpdate(updatedData: CandidateProcessing[]): void;
}

export interface IJobProcessStepRepository extends IBaseRepository<JobProcessStep> {}

export interface IOrganizationRepository extends IBaseRepository<Organization> {}

export interface IOrganizationProcessStepRepository extends IBaseRepository<OrganizationProcessStep> {}