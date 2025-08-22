alter table candidate_job_results enable row level security;

create policy "Users can view their own candidate_job_results"
on candidate_job_results for select
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_job_results.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own candidate_job_results"
on candidate_job_results for insert
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidate_job_results.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own candidate_job_results"
on candidate_job_results for update
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_job_results.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidate_job_results.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own candidate_job_results"
on candidate_job_results for delete
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_job_results.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);