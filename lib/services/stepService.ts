import type { 
    JobProcessStep,
} from "@/types/entities";
import type { IStepService } from "@/types/services";
import type {
    Client
} from "@/providers/DBClientProvider";

import { IJobProcessStepRepository } from "@/types/repositories";
import { FactoryRepository } from "@/lib/repositories/factoryRepository";

export class StepService implements IStepService {
    private repo: IJobProcessStepRepository;

    constructor(client: Client) {
        const factory = new FactoryRepository(client);
        this.repo = factory.createJobProcessStep();
    }

    async create (
        jobId: string,
        title: string,
        description: string,
        newOrder: number
    ): Promise<JobProcessStep> {
        try {
            const data = await this.repo.create({
                job_id: jobId,
                title,
                description,
                sort_order: newOrder
            })
            return data;
        } catch (err) {
            throw err;
        }
    }

    async update (
        stepId: string,
        title: string,
        description: string
    ): Promise<JobProcessStep> {
        try {
            const data = await this.repo.update(stepId, {
                title,
                description
            })
            return data;
        } catch (err) {
            throw err;
        }
    }
}
