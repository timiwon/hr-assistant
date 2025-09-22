create table public.candidates_has_candidate_titles (
  candidate_id bigint not null,
  candidate_title_id bigint not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint candidates_has_candidate_titles_pkey primary key (candidate_id, candidate_title_id),
  constraint candidates_has_candidate_titles_candidate_id_fkey foreign KEY (candidate_id) references candidates (id) on delete CASCADE,
  constraint candidates_has_candidate_titles_candidate_title_id_fkey foreign KEY (candidate_title_id) references candidate_titles (id) on delete CASCADE
) TABLESPACE pg_default;