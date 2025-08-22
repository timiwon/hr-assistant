alter table candidates_has_candidate_titles enable row level security;

create policy "Users can view their own candidates_has_candidate_titles"
on candidates_has_candidate_titles for select
using (
    exists(
        select 1 from candidates
        where candidates.id = candidates_has_candidate_titles.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can insert their own candidates_has_candidate_titles"
on candidates_has_candidate_titles for insert
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidates_has_candidate_titles.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can update their own candidates_has_candidate_titles"
on candidates_has_candidate_titles for update
using (
    exists(
        select 1 from candidates
        where candidates.id = candidates_has_candidate_titles.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
)
with check (
    exists(
        select 1 from candidates
        where candidates.id = candidates_has_candidate_titles.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);

create policy "Users can delete their own candidates_has_candidate_titles"
on candidates_has_candidate_titles for delete
using (
    exists(
        select 1 from candidates
        where candidates.id = candidates_has_candidate_titles.candidate_id
            and candidates.owner_id = (auth.jwt()->>'sub')::text
    )
);