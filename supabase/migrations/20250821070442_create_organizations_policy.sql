alter table organizations enable row level security;

create policy "Users can view their own organizations"
on organizations for select
using (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can insert their own organizations"
on organizations for insert
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can update their own organizations"
on organizations for update
using (owner_id = (auth.jwt()->>'sub')::text)
with check (owner_id = (auth.jwt()->>'sub')::text);

create policy "Users can delete their own organizations"
on organizations for delete
using (owner_id = (auth.jwt()->>'sub')::text);