"use client";

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

import Navbar from "@/components/navbar";
import { useJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import type {
    CandidateProcessing,
    CandidateProcessingStatus,
    JobProcessStep,
} from '@/types/entities';
import DragComponent from '@/components/DragComponent/DragComponent';
import EditJobDialog from './components/dialogs/EditJobDialog';
import ProcessingFiltersDialog from './components/dialogs/ProcessingFiltersDialog';
import AddCandidateDialog from './components/dialogs/AddCandidateDialog';
import EditStepDialog from './components/dialogs/EditStepDialog';
import DialogStepCreate from './components/dialogs/DialogStepCreate';

function JobPage() {
    const { id } = useParams<{ id: string }>();
    const {
        job,
        steps,
        updateJob,
        addCandidate,
        moveProcess,
        updateProcessOrder,
        createStep,
        updateStep
    } = useJob(id);
    const [isEditingJob, setIsEditingJob] = useState<boolean>(false);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const [isCreatingStep, setIsCreatingStep] = useState<boolean>(false);

    const [isEditingStep, setIsEditingStep] = useState<boolean>(false);
    const [editingStep, setEditingStep] = useState<JobProcessStep | null>(null);

    async function handleUpdateJob (jobId: string, jobTitle: string, jobDescription: string) {
        try {
            await updateJob(jobId, {
                title: jobTitle,
                description: jobDescription
            });
            setIsEditingJob(false);
        } catch (err) {
            console.log(err)
        }
    }

    async function handleCreateCandidateProcessing(
        candidateId: string,
        candidateProcessingData:
            Omit<CandidateProcessing, "id" | "created_at" | "updated_at" | "job_process_step_id" | "candidate_id" | "sort_order">,
    ) {
        const targetStep = steps[0];
        if (!targetStep) {
            throw new Error("No step available to add candidate");
        }

        await addCandidate(targetStep.id, candidateId, candidateProcessingData)
    }

    async function handleAddCandidate(candidateId: string, status: CandidateProcessingStatus, note: string | null, dueDate: string | null) {
        const candidateProcessingData: Omit<
            CandidateProcessing,
            "id" | "created_at" | "updated_at" | "job_process_step_id" | "candidate_id" | "sort_order"
        > = {
            status,
            note,
            due_date: dueDate,
        };
        await handleCreateCandidateProcessing(candidateId, candidateProcessingData);
    }

    async function handleCreateStep(title: string, description: string) {
        await createStep(title, description);
        setIsCreatingStep(false);
    }

    async function handleUpdateStep(title: string, description: string) {
        if (!editingStep) {
            return;
        }

        await updateStep(editingStep.id, title, description);

        setIsEditingStep(false);
        setEditingStep(null);
    }

    async function handleEditColumn(id: string) {
        const targetStep = steps.find(item => item.id === id);
        setIsEditingStep(true);
        setEditingStep(targetStep??null);
    }

    function getStatusColor(status: CandidateProcessingStatus): string {
        switch(status) {
            case "processing":
                return "bg-blue-600";
            case "done":
                return "bg-green-600";
            case "failed":
                return "bg-red-600";
            default:
                return "bg-gray-600";
        }
    }

    const dragableColumns = React.useMemo(() => {
        return steps.map(step => {
            const {
                candidate_processings,
                ...rest
            } = step;
            return {
                ...rest,
                description: rest.description ?? ""
            };
        })
    }, [steps]);

    const dragableRows = React.useMemo(() => {
        return steps.reduce((accumulator: {
            [key: string]: {
                id: string;
                columnId: string;
                title: string;
                description: string;
                sortOrder: number;
                actionComponent: React.ReactNode;
            }[]
        }, step) => {
            accumulator[step.id] = step.candidate_processings.map(processing => ({
                id: processing.id,
                columnId: step.id,
                title: processing.candidate.first_name,
                description: processing.note ?? "",
                sortOrder: processing.sort_order,
                actionComponent: (<div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                        {processing.due_date && (
                            <div className="flex items-center space-x-1 text-xs text-gray-300">
                                <Calendar className="h-3 w-3" />
                                <span className="truncate">{processing.due_date}</span>
                            </div>
                        )}
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(processing.status)}`} />
                    </div>
                </div>)
            }));
            return accumulator;
        }, {});
    }, [steps]);

    return (<>
        <div className='min-h-screen bg-gray-50'>
            <Navbar
                jobTitle={job?.title}
                onEditJob={() => {
                    setIsEditingJob(true);
                }}
                onFilterClick={() => {
                    setIsFilterOpen(true);
                }}
                filterCount={2}
            />

           {job && isEditingJob && <EditJobDialog
                isOpen={isEditingJob}
                job={job}
                onOpenChange={setIsEditingJob}
                onSubmit={handleUpdateJob}
                onCancel={() => setIsEditingJob(false)}
            /> }

            {isFilterOpen && <ProcessingFiltersDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onCancel={() => { setIsFilterOpen(false) }}
            />}
            {/* Job Content */}
            <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                {/* Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">Total Candidates: </span>
                            {steps.reduce((sum, step) => sum + step.candidate_processings.length, 0)}
                        </div>
                    </div>

                    {/* Add candidate dialog */}
                    <AddCandidateDialog
                        onSubmit={handleAddCandidate}
                    />
                </div>

                {/** Job Processing Steps */}
                <DragComponent
                    columns={dragableColumns}
                    rows={dragableRows}
                    handleEditColumn={handleEditColumn}
                    onDragEnd={updateProcessOrder}
                    onDragOver={moveProcess}
                    addColumnBtn={
                        <Button
                            variant="outline"
                            className="w-full h-full min-h-[200px] border-dashed border-2 text-gray-400 hover:text-gray-500  hover:cursor-pointer"
                            onClick={() => setIsCreatingStep(true)}
                        >
                            <Plus />
                            Add another step
                        </Button>
                    }
                />
            </main>
        </div>

        {isCreatingStep && <DialogStepCreate
            open={isCreatingStep}
            onOpenChange={setIsCreatingStep}
            onSubmit={handleCreateStep}
            onCancel={() => setIsCreatingStep(false)}
        />}

        {isEditingStep && editingStep && <EditStepDialog
            open={isEditingStep}
            data={editingStep}
            onOpenChange={setIsEditingStep}
            onSubmit={handleUpdateStep}
            onCancel={() => {
                setIsEditingStep(false);
                setEditingStep(null);
            }}
        />}
    </>);
}

export default JobPage;