import { SupabaseClient } from "@supabase/supabase-js";

export type Client = SupabaseClient;

export interface Organization {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationProcessStep {
    id: string;
    title: string;
    description: string | null;
    sort_order: number;
    organization_id: string;
    created_at: string;
    updated_at: string;
}

export interface JobDomain {
    id: string;
    key: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface JobType {
    id: string;
    key: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface Job {
    id: string;
    status: "open" | "close" | "pending";
    priority: "low" | "medium" | "high";
    title: string;
    description: string | null;
    candidate_amount: number;
    organization_id: string;
    domain_id: string;
    created_at: string;
    updated_at: string;
}

export interface JobProcessStep {
    id: string;
    title: string;
    description: string | null;
    sort_order: number;
    job_id: string;
    created_at: string;
    updated_at: string;
}

export interface CandidateTitle {
    id: string;
    key: string;
    title: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface Candidate {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    description: string | null;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface CandidateProcessing {
    id: string;
    candidate_id: string;
    job_process_step_id: string;
    status: "processing" | "done" | "failed";
    note: string | null;
    created_at: string;
    updated_at: string;
}

export interface CandidateJobResult {
    id: string;
    created_at: string;
    udpated_at: string;
    candidate_id: string;
    job_id: string;
    status: "success" | "failed" | "wrong_level";
    note: string | null;
}