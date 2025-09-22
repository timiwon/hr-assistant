import type { 
    CandidateProcessing,
    CandidateProcessingWithCandidate,
} from "@/types/entities";
import type { IProcessingService } from "@/types/services";
import type {
    Client
} from "@/providers/DBClientProvider";

import { FactoryRepository } from "@/lib/repositories/factoryRepository";
import { ICandidateProcessingRepository } from "@/types/repositories";

export class ProcessingService implements IProcessingService {
    private repo: ICandidateProcessingRepository;

    constructor(client: Client) {
        const factory = new FactoryRepository(client);
        this.repo = factory.createCandidateProcessing();
    }

    async create (
        stepId: string,
        candidateId: string,
        candidateProcessingData: {
            status: "processing" | "done" | "failed";
            note: string | null;
            due_date: string | null;
            sort_order: number;
        }
    ): Promise<CandidateProcessingWithCandidate> {
        try {
            const processingData = await this.repo.create({
                candidate_id: candidateId,
                job_process_step_id: stepId,
                status: candidateProcessingData.status,
                note: candidateProcessingData.note,
                due_date: candidateProcessingData.due_date,
                sort_order: candidateProcessingData.sort_order
            })
            const result = await this.repo.getSpecificWithCandidate(stepId, candidateId);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async move(updatedData: CandidateProcessing[]) {
        try {
            await this.repo.bulkUpdate(updatedData);
        } catch (err) {
            throw err;
        }
    }
}
