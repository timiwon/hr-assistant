import { Client, Organization } from "@/types/models";
import { getPagination } from "@/lib/utils";

export const organizationRepository = (client: Client) => {
    const table = client.from("organizations");

    return {
        async getList(
            page: number = 1,
            perPage: number = 10,
        ): Promise<Organization[]> {
            try {
                const {startIndex, endIndex} = getPagination(page, perPage);
                const {data, error} = await table
                    .select("*")
                    .range(startIndex, endIndex)
                    .order("created_at", { ascending: false });
                
                if (error) {
                    throw error;
                }

                return data || [];
            } catch (err) {
                throw err
            }
        },

        async create(
            organization: Omit<Organization, "id" | "created_at" | "updated_at" | "owner_id">
        ): Promise<Organization> {
            try {
                const {data, error} = await table
                    .insert(organization)
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
}