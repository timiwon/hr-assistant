import { Client } from "@/types/models";
import { getPagination } from "@/lib/utils";

export type ListResponse<T> = {
    data: T[],
    count: number | null
}

type Filter = {
    column: string,
    operation: string,
    value: unknown
}

export default abstract class BaseRepository<T> {
    protected table: string;
    protected client: Client;
    private filters: Filter[];
    private select: string;

    constructor(client: Client, table: string) {
        this.client = client;
        this.table = table;
        this.filters = [];
        this.select = '*';
    }

    setFilters(filters: Filter[]) {
        this.filters = filters;
    }

    setSelect(select: string) {
        this.select = select;
    }

    async getCount(): Promise<number | null> {
        const query = this.client.from(this.table).select('*', {count: 'estimated', head: true});
        this.filters.forEach((filter) => {
            query.filter(filter.column, filter.operation, filter.value);
        });

        const { count } = await query.overrideTypes();

        return count;
    }

    async getList(page: number, perPage: number): Promise<ListResponse<T>> {
        try {
            const query = this.client.from(this.table).select(this.select);

            this.filters.forEach((filter) => {
                query.filter(filter.column, filter.operation, filter.value);
            });

            const { startIndex, endIndex } = getPagination(page, perPage);
            query.range(startIndex, endIndex)
                .order('updated_at', {ascending: false});
            
            const [ countResponse, dataResponse ] = await Promise.all([
                this.getCount(),
                query.overrideTypes<T[], {merge: false}>()
            ]);

            if (dataResponse.error) {
                throw dataResponse.error;
            }

            return {
                data: dataResponse.data,
                count: countResponse
            };
        } catch (err) {
            throw err;
        }
    }

    async create(
        params: Omit<T, "id" | "created_at" | "updated_at" | "owner_id">
    ): Promise<T> {
        try {
            const {data, error} = await this.client.from(this.table)
                .insert(params)
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
}