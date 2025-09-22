import type { CandidateProcessing, CandidateProcessingWithCandidate } from "@/types/entities";
import type { ICandidateProcessingRepository } from "@/types/repositories";
import type { Client } from "@/providers/DBClientProvider";
import BaseRepository from "@/lib/repositories/baseRepository";

export class CandidateProcessingRepository extends BaseRepository<CandidateProcessing> implements ICandidateProcessingRepository {
    constructor(client: Client) {
        super(client, 'candidate_processings');
    }

    async getListByJobId(jobId: string): Promise<CandidateProcessingWithCandidate[]> {
        try {
            const { data, error } = await this.client.from(this.table)
                .select(`
                    *,
                    candidate:candidates (
                        first_name,
                        last_name,
                        email,
                        phone_number
                    ),
                    job_process_steps(id)
                `)
                .eq("job_process_steps.job_id", jobId)
                .order('created_at', {ascending: false});

            if (error) {
                throw error;
            }

            return data;
        } catch (err) {
            throw err;
        }
    }

    async getSpecificWithCandidate(stepId: string, candidateId: string): Promise<CandidateProcessingWithCandidate> {
        try {
            const { data, error } = await this.client.from(this.table)
                .select(`
                    *,
                    candidate:candidates (
                        first_name,
                        last_name,
                        email,
                        phone_number
                    ),
                    job_process_steps(id)
                `)
                .eq("job_process_step_id", stepId)
                .eq("candidate_id", candidateId)
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (err) {
            throw err;
        }
    }

    async bulkUpdate(updatedData: CandidateProcessing[]) {
        try {
            const { error } = await this.client.from(this.table)
                .upsert(updatedData, { onConflict: 'id' });

            if (error) {
                throw error;
            }
        } catch (err) {
            throw err;
        }
    }
}
