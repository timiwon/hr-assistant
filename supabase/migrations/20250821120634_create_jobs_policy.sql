alter table jobs enable row level security;

create policy "Users can view their own jobs"
on jobs for select
using (
    exists(
        select 1 from organizations
        where organizations.id = jobs.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own jobs"
on jobs for insert
with check (
    exists(
        select 1 from organizations
        where organizations.id = jobs.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own jobs"
on jobs for update
using (
    exists(
        select 1 from organizations
        where organizations.id = jobs.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from organizations
        where organizations.id = jobs.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own jobs"
on jobs for delete
using (
    exists(
        select 1 from organizations
        where organizations.id = jobs.organization_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);