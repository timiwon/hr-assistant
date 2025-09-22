import React, { useEffect, useState } from 'react';

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
import { JobProcessStep } from '@/types/entities';

type EditStepDialogProps = {
    open: boolean;
    data: JobProcessStep;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (title: string, description: string) => Promise<void>;
    onCancel: () => void;
};

const EditStepDialog = ({
    open,
    data,
    onOpenChange,
    onSubmit,
    onCancel
}: EditStepDialogProps) => {
    const [editingStepTitle, setEditingStepTitle] = useState<string>("");
    const [editingStepDescription, setEditingStepDescription] = useState<string>("");

    useEffect(() => {
        setEditingStepTitle(data.title);
        setEditingStepDescription(data.description??"");
    }, [data]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingStepTitle.trim()) return;

        onSubmit(editingStepTitle.trim(), editingStepDescription.trim());
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                <DialogHeader>
                    <DialogTitle>Edit Step</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Update step infomation
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label>Step Title *</Label>
                        <Input
                            id="stepTitle"
                            placeholder="Enter step title..."
                            value={editingStepTitle}
                            onChange={(e) => setEditingStepTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Step Description</Label>
                        <Textarea
                            id="stepDescription"
                            value={editingStepDescription}
                            onChange={(e) => setEditingStepDescription(e.target.value)}
                            placeholder="Enter step description..."
                        />
                    </div>
                    <div className="space-y-2 space-x-2 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >Cancel</Button>
                        <Button type="submit">Update Step</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditStepDialog