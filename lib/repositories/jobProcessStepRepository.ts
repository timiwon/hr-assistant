import { Client, JobProcessStep } from "../../types/models";
import BaseRepository from "@/lib/repositories/baseRepository";

export class JobProcessStepRepository extends BaseRepository<JobProcessStep>{
    constructor(client: Client) {
        super(client, 'job_process_steps');
    }
}
