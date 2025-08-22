"use client";

import { useState } from "react";

import { useUser } from "@/providers/SignedInUserProvider";
import { useDBClient } from "@/providers/DBClientProvider";
import { jobService } from "@/lib/services/jobService";

import type { Job } from "@/types/models";

export function useJobs() {
    const { user } = useUser();
    const { dbClient } = useDBClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const service = jobService(dbClient!);

    async function getListJob(page: number, perPage: number) {
        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        try {
            const data = await service.getList(page, perPage);
            setJobs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get jobs.");
        } finally {
            setLoading(false);
        }
    }

    async function createJob(params: {
        organization: {
            name: string,
            description: string | null,
        },
        job: {
            title: string,
            description: string | null,
            priority: "low" | "medium" | "high",
            candidate_amount: number
        },
    }) {
        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        try {
            const result = await service.createJobWithDefaultData(params);
            setJobs((prev) => [result, ...prev]);
        } catch(err) {
            setError(err instanceof Error ? err.message : "Failed to create job.");
        } finally {
            setLoading(false);
        }
    }

    return {
        jobs,
        loading,
        error,
        createJob,
        getListJob
    };
}