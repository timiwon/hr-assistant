import React, { useEffect, useState } from 'react';

import type { Job } from '@/types/entities';
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

type EditJobDialogProps = {
    isOpen: boolean;
    job: Job;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (jobId: string, jobTitle: string, jobDescription: string) => Promise<void>;
    onCancel: () => void;
};

const EditJobDialog = ({
    isOpen,
    job,
    onOpenChange,
    onSubmit,
    onCancel
}: EditJobDialogProps) => {
    const [newJobTitle, setNewJobTitle] = useState<string>("");
    const [newJobDescription, setNewJobDescription] = useState<string>("");

    useEffect(() => {
        setNewJobTitle(job.title);
        setNewJobDescription(job.description??"")
    }, [job]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!newJobTitle.trim() || !job) {
            return;
        }

        try {
            onSubmit(job.id, newJobTitle.trim(), newJobDescription.trim());
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                <DialogHeader>
                    <DialogTitle>Edit Job</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">Update job infomation</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                            id="jobTitle"
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            placeholder="Enter job title..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <Textarea
                            id="jobDescription"
                            value={newJobDescription}
                            onChange={(e) => setNewJobDescription(e.target.value)}
                            placeholder="Enter job description..."
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditJobDialog