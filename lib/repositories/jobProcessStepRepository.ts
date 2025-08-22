import { Client, JobProcessStep } from "../../types/models";

export const jobProcessStepRepository = (client: Client) => {
    const table = client.from("job_process_steps");

    return {
        async create(
            step: Omit<JobProcessStep, "id" | "created_at" | "updated_at">
        ): Promise<JobProcessStep> {
            try {
                const {data, error} = await table
                    .insert(step)
                    .select()
                    .single();
                
                if (error) {
                    throw error;
                }

                return data;
            } catch (err) {
                throw err
            }
        }
    }
};