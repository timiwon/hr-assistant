alter table job_process_steps enable row level security;

create policy "Users can view their own job_process_steps"
on job_process_steps for select
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = job_process_steps.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own job_process_steps"
on job_process_steps for insert
with check (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = job_process_steps.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own job_process_steps"
on job_process_steps for update
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = job_process_steps.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = job_process_steps.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own job_process_steps"
on job_process_steps for delete
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = job_process_steps.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);