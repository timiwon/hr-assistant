import { Client, Organization } from "@/types/models";
import BaseRepository from "@/lib/repositories/baseRepository";

export class OrganizationRepository extends BaseRepository<Organization>{
    constructor(client: Client) {
        super(client, 'organizations');
    }
}
