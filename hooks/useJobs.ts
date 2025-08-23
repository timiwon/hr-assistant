"use client";

import { useEffect, useState } from "react";

import { useUser } from "@/providers/SignedInUserProvider";
import { useDBClient } from "@/providers/DBClientProvider";
import { JobService } from "@/lib/services/jobService";

import type { Job } from "@/types/models";
import { getErrorMessage } from "@/lib/utils";

export function useJobs() {
    const { user } = useUser();
    const { dbClient } = useDBClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsCount, setJobsCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const service = new JobService(dbClient!);

    async function loadJobs(page: number, perPage: number) {
        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        setError(null);
        try {
            const { data, count } = await service.getList(page, perPage);
            setJobs(data);
            setJobsCount(count);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to get jobs."));
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
        setError(null);
        try {
            const result = await service.createJobWithDefaultData(params);
            setJobs((prev) => [result, ...prev]);
            setJobsCount(jobsCount ? jobsCount + 1 : null);
        } catch(err) {
            setError(getErrorMessage(err, "Failed to create job."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            return;
        }

        loadJobs(1, 2);
    }, [user, dbClient]);

    return {
        jobs,
        jobsCount,
        loading,
        error,
        createJob,
        loadJobs
    };
}