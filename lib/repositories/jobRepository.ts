import { Client, Job } from "@/types/models";
import { getPagination } from "@/lib/utils";

export const jobRepository = (client: Client) => {
    const table = client.from("jobs");

    return {
        async getList(
            page: number = 1,
            perPage: number = 10,
        ):Promise<Job[]> {
            try {
                const {startIndex, endIndex} = getPagination(page, perPage);
                const {data, error} = await table
                    .select("*")
                    .range(startIndex, endIndex);
                
                if (error) {
                    throw error;
                }

                return data || [];
            } catch (err) {
                throw err;
            }
        },

        async createJob(
            job: Omit<Job, "id" | "created_at" | "updated_at">
        ): Promise<Job> {
            try {
                const {data, error} = await table
                    .insert(job)
                    .select()
                    .single();
                
                if (error) {
                    throw error;
                }

                return data;
            } catch (err) {
                throw err;
            }

        }
    };
};