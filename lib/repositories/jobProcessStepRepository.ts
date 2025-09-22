import type { JobProcessStep } from "@/types/entities";
import type { Client } from "@/providers/DBClientProvider"
import { IJobProcessStepRepository } from "@/types/repositories";
import BaseRepository from "@/lib/repositories/baseRepository";

export class JobProcessStepRepository extends BaseRepository<JobProcessStep> implements IJobProcessStepRepository{
    constructor(client: Client) {
        super(client, 'job_process_steps');
    }
}
