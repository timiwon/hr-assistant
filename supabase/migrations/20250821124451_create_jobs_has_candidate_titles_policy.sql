alter table jobs_has_candidate_titles enable row level security;

create policy "Users can view their own jobs_has_candidate_titles"
on jobs_has_candidate_titles for select
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = jobs_has_candidate_titles.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own jobs_has_candidate_titles"
on jobs_has_candidate_titles for insert
with check (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = jobs_has_candidate_titles.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own jobs_has_candidate_titles"
on jobs_has_candidate_titles for update
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = jobs_has_candidate_titles.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = jobs_has_candidate_titles.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own jobs_has_candidate_titles"
on jobs_has_candidate_titles for delete
using (
    exists(
        select 1 from jobs
        join organizations on organizations.id = jobs.organization_id
        where jobs.id = jobs_has_candidate_titles.job_id
            and organizations.owner_id = (auth.jwt()->>'sub')::text
    )
);