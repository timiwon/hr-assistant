import type { Organization } from "@/types/entities";
import type { Client } from "@/providers/DBClientProvider";
import { IOrganizationRepository } from "@/types/repositories";
import BaseRepository from "@/lib/repositories/baseRepository";

export class OrganizationRepository extends BaseRepository<Organization> implements IOrganizationRepository {
    constructor(client: Client) {
        super(client, 'organizations');
    }
}
