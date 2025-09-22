import type { OrganizationProcessStep } from "@/types/entities";
import type { Client } from "@/providers/DBClientProvider";
import { IOrganizationProcessStepRepository } from "@/types/repositories";
import BaseRepository from "@/lib/repositories/baseRepository";

export class OrganizationProcessStepRepository extends BaseRepository<OrganizationProcessStep> implements IOrganizationProcessStepRepository{
    constructor(client: Client) {
        super(client, 'organization_process_steps');
    }
}
