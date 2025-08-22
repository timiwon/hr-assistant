
alter table candidates enable row level security;

create policy "Users can view their own candidates"
on candidates for select
using (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can insert their own candidates"
on candidates for insert
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can update their own candidates"
on candidates for update
using (owner_id = (auth.jwt()->>'sub')::text)
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can delete their own candidates"
on candidates for delete
using (owner_id = (auth.jwt()->>'sub')::text);