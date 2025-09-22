"use client";

import { useEffect, useState } from "react";
import { debounce } from "lodash";

import { useUser } from "@/providers/SignedInUserProvider";
import { useDBClient } from "@/providers/DBClientProvider";
import { JobService } from "@/lib/services/jobService";
import { ProcessingService } from "@/lib/services/processingService";

import type {
    Organization,
    Job,
    JobProcessStepWithCandidateProcessings,
    CandidateProcessingWithCandidate
} from "@/types/entities";
import { getErrorMessage } from "@/lib/utils";
import { StepService } from "@/lib/services/stepService";

export function useJobs() {
    const { user } = useUser();
    const { dbClient } = useDBClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsCount, setJobsCount] = useState<number | null>(null);
    const [recentActivityJobsCount, setRecentActivityJobsCount] = useState<number | null>(null);
    const [pendingJobsCount, setPendingJobsCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const service = new JobService(dbClient!);

    useEffect(() => {
        if (!user) {
            return;
        }

        debounceLoadJobs(1, 3);
        debounceLoadStats();
    }, [user, dbClient]);

    const debounceLoadStats = debounce(loadStats, 500);
    async function loadStats() {
        if (!user) {
            throw Error("User not authenticated")
        }
        
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recentActivityFilters = [{
                column: 'updated_at',
                operation: 'gt',
                value: oneWeekAgo.toLocaleString()
            }];
            const pendingFilters = [{
                column: 'status',
                operation: 'eq',
                value: 'pending'
            }];

            const [total, recentTotal, pendingTotal] = await Promise.all([
                service.getCount([]),
                service.getCount(recentActivityFilters),
                service.getCount(pendingFilters),
            ]);

            setJobsCount(total);
            setRecentActivityJobsCount(recentTotal);
            setPendingJobsCount(pendingTotal);
        } catch (err) {
            // do nothing
        }
    }

    const debounceLoadJobs = debounce(loadJobs, 500);
    async function loadJobs(page: number, perPage: number) {
        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        setError(null);
        try {
            const data = await service.getList([], page, perPage);
            setJobs(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to get jobs."));
        } finally {
            setLoading(false);
        }
    }

    async function createJob(params: {
        organization: Omit<Organization, "id" | "created_at" | "updated_at" | "owner_id">,
        job: Omit<Job, "id" | "created_at" | "updated_at" | "owner_id">
    }) {
        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        setError(null);
        try {
            const result = await service.createJobWithDefaultData(params);
            setJobs((prev) => [result, ...prev]);
            setJobsCount(jobsCount ? jobsCount + 1 : 1);
            setRecentActivityJobsCount(recentActivityJobsCount ? recentActivityJobsCount + 1 : 1);
            if (result.status === 'pending') {
                setPendingJobsCount(pendingJobsCount ? pendingJobsCount + 1 : 1);
            }
        } catch(err) {
            setError(getErrorMessage(err, "Failed to create job."));
        } finally {
            setLoading(false);
        }
    }

    return {
        jobs,
        jobsCount,
        pendingJobsCount,
        recentActivityJobsCount,
        loading,
        error,
        createJob,
        loadJobs: debounceLoadJobs
    };
}

export function useJob(jobId: string) {
    const { user } = useUser();
    const { dbClient } = useDBClient();
    const [job, setJob] = useState<Job | null>(null);
    const [steps, setSteps] = useState<JobProcessStepWithCandidateProcessings[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const service = new JobService(dbClient!);
    const processingService = new ProcessingService(dbClient!);
    const stepService = new StepService(dbClient!);

    useEffect(() => {
        if (!user || !jobId) {
            return;
        }

        debounceLoadJob();
    }, [user, jobId, dbClient]);

    const debounceLoadJob = debounce(loadJob, 100);
    async function loadJob() {
        if (!jobId) {
            return;
        }

        if (!user) {
            throw Error("User not authenticated")
        }

        setLoading(true);
        setError(null);
        try {
            const data = await service.getJobWithSteps(jobId);
            setJob(data.job);
            let sortedSteps = [...data.steps];
            
            setSteps(sortedSteps.map(item => {
                const candidate_processings = [...item.candidate_processings];
                candidate_processings.sort((a, b) => a.sort_order - b.sort_order);
                return {
                    ...item,
                    candidate_processings
                }
            }));
        } catch (err) {
            setError(getErrorMessage(err, "Failed to get jobs."));
        } finally {
            setLoading(false);
        }
    }

    async function updateJob(jobId: string, data: Partial<Job>) {
        try {
            const updatedJob = await service.updateJob(jobId, data);
            setJob(updatedJob);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to udpate the job."));
        }
    }

    async function addCandidate(
        stepId: string,
        candidateId: string,
        candidateProcessingData: {
            status: "processing" | "done" | "failed";
            note: string | null;
            due_date: string | null;
        }
    ) {
        try {
            const newProcessing = await processingService.create(stepId, candidateId, {
                status: candidateProcessingData.status,
                note: candidateProcessingData.note,
                due_date: candidateProcessingData.due_date,
                sort_order: steps.find(step => step.id = stepId)?.candidate_processings.length || 0
            });

            setSteps((prev) => 
                prev.map((item) =>
                    item.id === stepId ? {
                        ...item,
                        candidate_processings: [...item.candidate_processings, newProcessing]
                    } : item
                )
            );

            return newProcessing;
        } catch (err) {
            setError(getErrorMessage(err, "Failed to add candidate."));
        }
    }

    async function moveProcess(sourceStepId: string, targetStepId: string, activeIndex: number, overIndex: number) {
        const sourceStep = steps.find(step => step.id === sourceStepId);
        const targetStep= steps.find(step => step.id === targetStepId);

        if (!sourceStep || !targetStep) {
            return;
        }

        if (sourceStepId === targetStepId) {
            setSteps(prev => {
                let processings = sourceStep.candidate_processings;

                if (!processings) {
                    return prev;
                }

                const [removed] = processings.splice(activeIndex, 1);
                if (!removed) {
                    return prev;
                }

                processings.splice(overIndex, 0, removed);

                return prev.map(step => step.id === sourceStepId ? {
                    ...step,
                    candidate_processings: processings.map((item, index) => ({
                        ...item,
                        sort_order: index
                    }))
                } : step);
            });
        } else {
            setSteps(prev => {
                const sourceProcessings = [...sourceStep.candidate_processings];
                const targetProcessings = [...targetStep.candidate_processings];
                const [removed] = sourceProcessings.splice(activeIndex, 1);

                if (!removed) {
                    return prev;
                }

                targetProcessings.splice(overIndex, 0, removed);

                return prev.map(step => step.id === sourceStepId ? {
                    ...step,
                    candidate_processings: sourceProcessings.map((item, index) => ({
                        ...item,
                        sort_order: index
                    }))
                } : step.id === targetStepId ? {
                    ...step,
                    candidate_processings: targetProcessings.map((item, index) => ({
                        ...item,
                        sort_order: index
                    }))
                } : step);
            });
        }
    }

    async function updateProcessOrder(updatedData: Array<{rowId: string, columnId: string, index: number}>) {
        try {
            processingService.move(updatedData.map(item => {
                const targetStep = steps.find(step => step.id === item.columnId);
                const targetProcessing = targetStep?.candidate_processings.find(processing => processing.id === item.rowId);

                if (!targetProcessing) return null;

                const {
                    candidate,
                    job_process_steps,
                    ...rest
                } = targetProcessing;

                return {
                    ...rest,
                    job_process_step_id: item.columnId,
                    sort_order: item.index,
                    updated_at: new Date().toISOString()
                }
            }).filter(item => item !== null));
        } catch (err) {
            setError(getErrorMessage(err, "Failed to move candidate."));
        }
    }

    async function createStep(title: string, description: string) {
        if (!job) {
            throw new Error("Job not loading");
        }

        try {
            const newStep = await stepService.create(job.id, title, description, steps.length);
            setSteps(prev => [...prev, {...newStep, candidate_processings: []}]);
            return newStep;
        } catch (err) {
            setError(getErrorMessage(err, "Failed to create step."));
        }
    }

    async function updateStep(stepId: string, title: string, description: string) {
        if (!job) {
            throw new Error("Job not loading");
        }

        if (steps.findIndex(step => step.id === stepId) === -1) {
            throw new Error("Step not found");
        }

        try {
            const udpatedStep = await stepService.update(stepId, title, description);

            setSteps(prev =>
                prev.map(step => step.id === stepId ? {
                    ...step,
                    ...udpatedStep
                } : step)
            );
            return udpatedStep;
        } catch (err) {
            setError(getErrorMessage(err, "Failed to update step."));
        }
    }

    return {
        loading,
        error,
        job,
        steps,
        loadJob: debounceLoadJob,
        updateJob,
        addCandidate,
        moveProcess,
        updateProcessOrder,
        createStep,
        updateStep
    }
}