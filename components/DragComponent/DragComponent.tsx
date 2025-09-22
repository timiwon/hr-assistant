import React, { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors,
    useDroppable,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    MoreHorizontal,
    Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent
} from '@/components/ui/card';

type DoppableColumnProps = {
    id: string;
    title: string;
    description: string;
}

type RowOfDroppableColumnProps = {
    id: string;
    columnId: string;
    title: string;
    description: string;
    sortOrder:number;
    actionComponent: React.ReactNode;
}

const DroppableColumn = ({column, rowsLength, children, onEditColumn}: {
    column: DoppableColumnProps;
    rowsLength: number;
    children: React.ReactNode;
    onEditColumn: (id: string) => void;
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: `column_${column.id}` });

    return (
        <div ref={setNodeRef} className={`w-full lg:w-80 ${isOver ? "bg-blue-50 rounded-lg" : ""}`}>
            <div className={`bg-white rounded-lg shadow-sm border ${isOver ? "ring-2 ring-blue-300" : ""}`}>
                {/** Column Header */}
                <div className="p-3 sm:p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="font-semibold text-gray-600 text-sm sm:text-base truncate">{column.title}</h3>
                            <Badge variant="secondary" className="text-xs">{rowsLength} - {column.id}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => onEditColumn(column.id)}>
                            <MoreHorizontal/>
                        </Button>
                    </div>
                </div>

                {/** Column Content */}
                <div className="p-2">{children}</div>
            </div>
        </div>
    );
}

const SortableRow = ({
    id,
    title,
    columnId,
    description,
    actionComponent
}: RowOfDroppableColumnProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: `row_${id}`,
        transition: {
            duration: 150,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
    });

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (<div ref={setNodeRef} style={styles} {...listeners} {...attributes}>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                    {/** Row Header */}
                    <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-600 text-sm leading-tight flex-1 min-w-0 pr-2">{title} - {id}</h4>
                    </div>

                    {/** Row Description */}
                    <div className="text-xs text-gray-400 line-clamp-2">
                        <p>{description}</p>
                    </div>

                    {/** Row Action Component */}
                    {actionComponent}
                    {/*<div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                            {data.due_date && (
                                <div className="flex items-center space-x-1 text-xs text-gray-300">
                                    <Calendar className="h-3 w-3"/>
                                    <span className="truncate">{data.due_date}</span>
                                </div>
                            )}
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(data.status)}`}/>
                        </div>
                    </div>*/}
                </div>
            </CardContent>
        </Card>
    </div>);
};

const RowOverlay = ({ 
    id,
    title,
    description,
    actionComponent
 }: RowOfDroppableColumnProps) => {
    return (
        <Card id={`row_overlay_${id}`} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                    {/** Row Header */}
                    <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-600 text-sm leading-tight flex-1 min-w-0 pr-2">{title}</h4>
                    </div>

                    {/** Row Note */}
                    <div className="text-xs text-gray-400 line-clamp-2">
                        <p>{description}</p>
                    </div>

                    {/** Row Action Component */}
                    {actionComponent}
                </div>
            </CardContent>
        </Card>
    );
};

const DragComponent = ({
    columns,
    rows,
    handleEditColumn,
    onDragEnd,
    onDragOver,
    addColumnBtn
}: {
    columns: DoppableColumnProps[];
    rows: {[key: string]: RowOfDroppableColumnProps[]};
    handleEditColumn: (id: string) => void;
    onDragEnd: (data: Array<{rowId: string, columnId: string, index: number}>) => void;
    onDragOver: (sourceColumnId: string, targetColumnId: string, activeIndex: number, overIndex: number) => void;
    addColumnBtn: React.ReactNode | null;
}) => {
    const [activeRow, setActiveRow] = useState<RowOfDroppableColumnProps | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8
        }
    }));

    function _getIdFromDragEventId(id: string) {
        return id.slice(id.indexOf('_')+1, id.length);
    }

    function _getIndexFromDrageEventId(id: string, column: DoppableColumnProps) {
        if (!(column.id in rows)) {
            return -1;
        }

        const resultRows: RowOfDroppableColumnProps[] = rows[column.id as keyof typeof rows];
        return resultRows.findIndex(row => String(row.id) === _getIdFromDragEventId(id));
    }

    function _getColumnViaDragId(id: string) {
        const itemId = _getIdFromDragEventId(id);
        if (id.includes('column')) {
            return columns.find(col => String(col.id) === itemId);
        }

        const targetRow = Object.keys(rows).flatMap(key => rows[key]).find(row => String(row.id) === itemId);
        if (!targetRow) {
            return null;
        }

        return columns.find(col => col.id === targetRow.columnId);
    }

    function handleDragStart(event: DragStartEvent) {
        const rowId = _getIdFromDragEventId(event.active.id as string);
        const targetRow = Object.keys(rows).flatMap(key => rows[key]).find(row => String(row.id) === rowId);

        if (targetRow) {
            setActiveRow(targetRow);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;

        const rowId = _getIdFromDragEventId(active.id as string);
        const targetId = _getIdFromDragEventId(over.id as string);

        const sourceColumn = _getColumnViaDragId(active.id as string);
        const targetColumn = _getColumnViaDragId(over.id as string);

        if (!sourceColumn || !targetColumn) return;

        const sourceRows: RowOfDroppableColumnProps[] = rows[sourceColumn.id as keyof typeof rows];
        const targetRows: RowOfDroppableColumnProps[] = rows[targetColumn.id as keyof typeof rows];
        const activeIndex = sourceRows.findIndex(row => String(row.id) === rowId);

        if ((over.id as string).includes('column')) {
            // on case of moving item to a empty column
            if (sourceColumn.id === targetColumn.id) {
                return;
            }

            const overIndex = 0;
            onDragOver(sourceColumn.id, targetColumn.id, activeIndex, overIndex);
        } else {
            if (over.id === active.id) return;

            const overIndex = targetRows.findIndex(row => String(row.id) === targetId);
            onDragOver(sourceColumn.id, targetColumn.id, activeIndex, overIndex);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { over } = event;

        if (!activeRow || !over) return;

        const overId = over.id as string;

        const targetColumn = _getColumnViaDragId(overId);

        if (!targetColumn) return;

        const sourceRows = rows[activeRow.columnId];

        let results = sourceRows.map((row, index) => ({
            rowId: row.id,
            columnId: activeRow.columnId,
            index 
        }));

        if (activeRow.columnId !== targetColumn.id) {
            const targetRows = rows[targetColumn.id];
            results = [
                ...results,
                ...targetRows.map((row, index) => ({
                    rowId: row.id,
                    columnId: targetColumn.id,
                    index
                }))
            ];
        }

        onDragEnd(results);
        setActiveRow(null);
    }
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto
                        lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2
                        lg:[&::-webkit-scrollbar-track]:bg-gray-100
                        lg:[&::-webkit-scrollbar-thumb]:bg-gray-300
                        lg:[&::-webkit-scrollbar-thumb]:rounded-full
                        space-y-4 lg:space-y-0">
                {columns.map((column, index) => (
                    <DroppableColumn
                        key={index}
                        column={column}
                        rowsLength={(rows[column.id as keyof typeof rows] as RowOfDroppableColumnProps[]).length}
                        onEditColumn={handleEditColumn}
                    >
                        <SortableContext
                            items={
                                (rows[column.id as keyof typeof rows] as RowOfDroppableColumnProps[])
                                    .map(item => `row_${item.id}`)
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {
                                    (rows[column.id as keyof typeof rows] as RowOfDroppableColumnProps[])
                                        .map((row, key) => (
                                            <SortableRow
                                                key={key}
                                                id={row.id}
                                                columnId={row.columnId}
                                                title={row.title}
                                                description={row.description}
                                                sortOrder={row.sortOrder}
                                                actionComponent={row.actionComponent}
                                            />
                                        ))
                                }
                            </div>
                        </SortableContext>
                    </DroppableColumn>
                ))}

                {addColumnBtn && <div className="w-full lg:w-80">
                    {addColumnBtn}
                </div>}

                <DragOverlay>
                    {!activeRow ? null :
                    <RowOverlay
                        id={activeRow.id}
                        columnId={activeRow.columnId}
                        title={activeRow.title}
                        description={activeRow.description}
                        sortOrder={activeRow.sortOrder}
                        actionComponent={activeRow.actionComponent}
                    />}
                </DragOverlay>
            </div>
        </DndContext>
    )
}

export default DragComponent;