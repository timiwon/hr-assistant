alter table organization_process_steps enable row level security;

create policy "Users can view their own organization_process_steps"
on organization_process_steps for select
using (
    exists(
        select 1 from organizations
        where organizations.id = organization_process_steps.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own organization_process_steps"
on organization_process_steps for insert
with check (
    exists(
        select 1 from organizations
        where organizations.id = organization_process_steps.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own organization_process_steps"
on organization_process_steps for update
using (
    exists(
        select 1 from organizations
        where organizations.id = organization_process_steps.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from organizations
        where organizations.id = organization_process_steps.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own organization_process_steps"
on organization_process_steps for delete
using (
    exists(
        select 1 from organizations
        where organizations.id = organization_process_steps.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);