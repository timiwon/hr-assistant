import React from 'react';
import { Plus } from 'lucide-react';
import { DialogTrigger } from '@radix-ui/react-dialog';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { CandidateProcessingStatus } from '@/types/entities';

type AddCandidateDialogProps = {
    onSubmit: (
        candidateId: string,
        status: CandidateProcessingStatus,
        note: string | null,
        dueDate: string | null
    ) => Promise<void>;
};

const AddCandidateDialog = ({
    onSubmit
}: AddCandidateDialogProps) => {
    async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const status = "processing";
        const note = (formData.get("note") as string) || null;
        const dueDate = ((formData.get("due_date")) as string) || null;
        const candidateId = ((formData.get("candidate_id")) as string) || "3";

        if (candidateId) {
            await onSubmit(candidateId, status, note, dueDate);

            const trigger = document.querySelector('[data-state="open"]') as HTMLElement
            if (trigger) {
                trigger.click();
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <Plus />
                    Add Candidate
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                <DialogHeader>
                    <DialogTitle>Create new candidate</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">Add candidate to the job</DialogDescription>
                </DialogHeader>

                <form className='space-y-4' onSubmit={handleOnSubmit}>
                    <div className='space-y-2'>
                        <Label htmlFor='description'>Note</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            rows={3}
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='due_date'>Due Date *</Label>
                        <Input type="date" id="due_date" name="due_date" />
                    </div>

                    <div className='flex justify-end pt-4'>
                        <Button type='submit'>Add Candidate</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCandidateDialog