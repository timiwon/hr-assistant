import React, { useState } from 'react';

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

type DialogStepCreateProps = {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (title: string, description: string) => void;
    onCancel: () => void;
};

const DialogStepCreate = ({
    open,
    onOpenChange,
    onSubmit,
    onCancel
}: DialogStepCreateProps) => {
    const [newStepTitle, setNewStepTitle] = useState<string>("");
    const [newStepDescription, setNewStepDescription] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newStepTitle.trim()) return;

        onSubmit(newStepTitle.trim(), newStepDescription.trim());
    }

  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                <DialogHeader>
                    <DialogTitle>Create new Step</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Add a new step to job processing
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label>Step Title *</Label>
                        <Input
                            id="stepTitle"
                            placeholder="Enter step title..."
                            value={newStepTitle}
                            onChange={(e) => setNewStepTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Step Description</Label>
                        <Textarea
                            id="stepDescription"
                            value={newStepDescription}
                            onChange={(e) => setNewStepDescription(e.target.value)}
                            placeholder="Enter step description..."
                        />
                    </div>
                    <div className="space-y-2 space-x-2 flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >Cancel</Button>
                        <Button type="submit">Create Step</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
  )
}

export default DialogStepCreate