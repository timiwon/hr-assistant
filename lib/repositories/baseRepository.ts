import type { Client } from "@/providers/DBClientProvider";
import type { Filter, IBaseRepository } from "@/types/repositories";

import { getPagination } from "@/lib/utils";

type SelectOption = {
    head?: boolean,
    count?: "exact" | "planned" | "estimated",
}

type OrderOption = {
    ascending?: boolean | undefined,
    nullsFirst?: boolean | undefined,
    referencedTable?: undefined
};

export default abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected table: string;
    protected client: Client;
    private select: string;

    constructor(client: Client, table: string) {
        this.client = client;
        this.table = table;
        this.select = '*';
    }

    setSelect(select: string) {
        this.select = select;
        return this;
    }

    private buildFilters(filters: Filter[], isCounting = false) {
        const selectOptions: SelectOption | undefined = isCounting ? {count: 'estimated', head: true} : undefined;
        const select: string = isCounting ? 'id' : this.select; 
        const query = this.client.from(this.table).select(select, selectOptions);

        filters.forEach((filter) => {
            if (filter.operation === 'order') {
                query.order(filter.column, filter.value as OrderOption);
            } else {
                query.filter(filter.column, filter.operation, filter.value);
            }
        });

        return query;
    }

    async getCount(filters: Filter[]): Promise<number | null> {
        try {
            const query = this.buildFilters(filters, true);
            const { error, count } = await query.overrideTypes();

            if (error) {
                throw error;
            }

            return count;
        } catch (err) {
            throw err;
        }
    }

    async findById(id: string): Promise<T> {
        try {
            const { data, error } = await this.client
                .from(this.table)
                .select(this.select)
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            return data as T;
        } catch (err) {
            throw err;
        }
    }

    async getList(filters: Filter[], page: number, perPage: number): Promise<T[]> {
        try {
            const query = this.buildFilters(filters);

            const { startIndex, endIndex } = getPagination(page, perPage);
            query.range(startIndex, endIndex)
                .order('updated_at', {ascending: false});
            
            const { data, error } = await query.overrideTypes<T[], {merge: false}>();

            if (error) {
                throw error;
            }

            return data
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
                .select(this.select)
                .single();
            
            if (error) {
                throw error;
            }

            return data as T;
        } catch (err) {
            throw err;
        }
    }

    async update(
        id: string,
        updates: Partial<T>
    ): Promise<T> {
        try {
            const {data, error} = await this.client
                .from(this.table)
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select(this.select)
                .single();
            
            if (error) {
                throw error;
            }

            return data as T;
        } catch (err) {
            throw err;
        }
    }
}