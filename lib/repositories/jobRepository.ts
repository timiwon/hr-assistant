import { Client, Job } from "@/types/models";
import BaseRepository from "@/lib/repositories/baseRepository";

export class JobRepository extends BaseRepository<Job>{
    constructor(client: Client) {
        super(client, 'jobs');
    }
}