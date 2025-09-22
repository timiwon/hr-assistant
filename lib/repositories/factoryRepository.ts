import type { Client } from "@/providers/DBClientProvider";
import type {
    ICandidateProcessingRepository,
    ICandidateRepository,
    IJobProcessStepRepository,
    IJobRepository,
    IOrganizationProcessStepRepository,
    IOrganizationRepository
} from "@/types/repositories";
import { CandidateProcessingRepository } from "@/lib/repositories/candidateProcessingRepository";
import { CandidateRepository } from "@/lib/repositories/candidateRepository";
import { JobProcessStepRepository } from "@/lib/repositories/jobProcessStepRepository";
import { JobRepository } from "@/lib/repositories/jobRepository";
import { OrganizationRepository } from "@/lib/repositories/organizationRepository";
import { OrganizationProcessStepRepository } from "@/lib/repositories/organizationProcessStepRepository";

export class FactoryRepository {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    createCandidateProcessing(): ICandidateProcessingRepository {
        return new CandidateProcessingRepository(this.client);
    }

    createCandidate(): ICandidateRepository {
        return new CandidateRepository(this.client);
    }

    createJobProcessStep(): IJobProcessStepRepository {
        return new JobProcessStepRepository(this.client);
    }

    createJob(): IJobRepository {
        return new JobRepository(this.client);
    }

    createOrganizationProcessStep(): IOrganizationProcessStepRepository {
        return new OrganizationProcessStepRepository(this.client);
    }

    createOrganization(): IOrganizationRepository {
        return new OrganizationRepository(this.client);
    }
}