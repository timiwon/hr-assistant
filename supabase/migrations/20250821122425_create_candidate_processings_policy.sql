alter table candidate_processings enable row level security;

create policy "Users can view their own candidate_processings"
on candidate_processings for select
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_processings.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own candidate_processings"
on candidate_processings for insert
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidate_processings.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own candidate_processings"
on candidate_processings for update
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_processings.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidate_processings.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own candidate_processings"
on candidate_processings for delete
using (
    exists(
        select 1 from candidates
        where candidates.id = candidate_processings.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);