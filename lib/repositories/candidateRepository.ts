import type { Candidate } from "@/types/entities";
import type { Client } from "@/providers/DBClientProvider";
import type { ICandidateRepository } from "@/types/repositories";
import BaseRepository from "@/lib/repositories/baseRepository";

export class CandidateRepository extends BaseRepository<Candidate> implements ICandidateRepository {
    constructor(client: Client) {
        super(client, 'candidates');
    }
}
