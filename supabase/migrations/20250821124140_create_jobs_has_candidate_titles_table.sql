create table public.jobs_has_candidate_titles (
  job_id bigint not null,
  candidate_title_id bigint not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint jobs_has_candidate_titles_pkey primary key (job_id, candidate_title_id),
  constraint jobs_has_candidate_titles_job_id_fkey foreign KEY (job_id) references jobs (id) on delete CASCADE,
  constraint jobs_has_candidate_titles_candidate_title_id_fkey foreign KEY (candidate_title_id) references candidate_titles (id) on delete CASCADE
) TABLESPACE pg_default;