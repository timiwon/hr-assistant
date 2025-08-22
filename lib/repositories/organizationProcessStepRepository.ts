import { Client, OrganizationProcessStep } from "@/types/models";

export const organizationProcessStepRepository = (client: Client) => {
    const table = client.from("organization_process_steps");

    return {
        async create(
            step: Omit<OrganizationProcessStep, "id" | "created_at" | "updated_at">
        ): Promise<OrganizationProcessStep> {
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
                throw err;
            }
        }
    };
};