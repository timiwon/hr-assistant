import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ProcessingFiltersDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: () => void;
};

const ProcessingFiltersDialog = ({
    open,
    onOpenChange,
    onCancel
}: ProcessingFiltersDialogProps) => {
  return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                    <DialogHeader>
                        <DialogTitle>Filter Candidates</DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">Filter candidates by status or due date</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex flex-wrap gap-2">
                                {["processing", "done", "failed"].map((status, key) => (
                                    <Button
                                        key={key}
                                        size="sm"
                                        variant={"outline"}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input type="date"/>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant={"outline"}>Clear Filters</Button>
                            <Button type="button" onClick={onCancel}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
  )
}

export default ProcessingFiltersDialog