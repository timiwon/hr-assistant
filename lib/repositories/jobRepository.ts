import type { Job } from "@/types/entities";
import type { Client } from "@/providers/DBClientProvider";
import type { IJobRepository } from "@/types/repositories";
import BaseRepository from "@/lib/repositories/baseRepository";

export class JobRepository extends BaseRepository<Job> implements IJobRepository {
    constructor(client: Client) {
        super(client, 'jobs');
    }
}