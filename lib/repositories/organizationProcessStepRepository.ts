import { Client, OrganizationProcessStep } from "@/types/models";
import BaseRepository from "@/lib/repositories/baseRepository";

export class OrganizationProcessStepRepository extends BaseRepository<OrganizationProcessStep>{
    constructor(client: Client) {
        super(client, 'organization_process_steps');
    }
}
