import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import handakPermits from '@/routes/handak-permits';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { PermitStatusOptions } from '../../permits/types';
import { ApproveHandakPermitDialog } from '../dialogs/approve-dialog';
import { DeleteHandakPermitDialog } from '../dialogs/delete-dialog';
import { EditHandakPermitForm } from '../forms/edit-form-dialog';
import { IssueSiDialog } from '../forms/issue-si-dialog';
import { UsageFormDialog } from '../forms/usage-form-dialog';
import { RecommendationTypeOptions, THandakPermit } from '../types';

const ActionsCell = ({ row }: { row: Row<THandakPermit> }) => {
    const props = usePage<SharedData>().props;
    const abilities = props.auth.abilities ?? {};
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [approveDialog, setApproveDialog] = useState(false);
    const [issueSiDialog, setIssueSiDialog] = useState(false);
    const [usageDialog, setUsageDialog] = useState(false);

    const permit = row.original;
    const isEditable = ['draft', 'pending'].includes(permit.status);
    const isApproved = permit.status === 'approved';
    const isUsageType = permit.recommendation_type === 'P3' || permit.recommendation_type === 'P1';

    const canEdit = abilities['edit-handak-permits'] && isEditable;
    const canDelete = abilities['delete-handak-permits'] && isEditable;
    const canApprove = abilities['approve-handak-permits'] && isEditable;
    const canIssueSi = abilities['issue-handak-si'] && isApproved;
    const canRecordUsage = abilities['record-handak-usage'] && isUsageType && isApproved;
    const canPrint = abilities['print-handak-letter'];

    return (
        <>
            <DropdownMenu modal={false} key={permit.id}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {canApprove && (
                        <DropdownMenuItem onSelect={() => setApproveDialog(true)}>Setujui</DropdownMenuItem>
                    )}
                    {canIssueSi && (
                        <DropdownMenuItem onSelect={() => setIssueSiDialog(true)}>
                            {permit.si_number ? 'Ubah No SI' : 'Terbitkan No SI'}
                        </DropdownMenuItem>
                    )}
                    {canRecordUsage && (
                        <DropdownMenuItem onSelect={() => setUsageDialog(true)}>
                            Catat Pemakaian
                        </DropdownMenuItem>
                    )}
                    {canPrint && (
                        <DropdownMenuItem asChild>
                            <a href={handakPermits.letter(permit.id).url} target="_blank" rel="noreferrer">
                                Cetak Surat
                            </a>
                        </DropdownMenuItem>
                    )}
                    {canEdit && <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>}
                    {canDelete && (
                        <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>Delete</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {canDelete && (
                <DeleteHandakPermitDialog row={row} open={deleteDialog} onOpenChange={setDeleteDialog} />
            )}
            {canEdit && <EditHandakPermitForm row={row} open={editDialog} onOpenChange={setEditDialog} />}
            {canApprove && (
                <ApproveHandakPermitDialog row={row} open={approveDialog} onOpenChange={setApproveDialog} />
            )}
            {canIssueSi && <IssueSiDialog row={row} open={issueSiDialog} onOpenChange={setIssueSiDialog} />}
            {canRecordUsage && (
                <UsageFormDialog row={row} open={usageDialog} onOpenChange={setUsageDialog} />
            )}
        </>
    );
};

export const columns: ColumnDef<THandakPermit>[] = [
    {
        accessorKey: 'permit_number',
        header: 'No Rekom',
        cell: ({ row }) => (
            <span className="font-mono text-sm">{row.original.permit_number || '-'}</span>
        ),
    },
    {
        accessorKey: 'si_number',
        header: 'No SI',
        cell: ({ row }) =>
            row.original.si_number ? (
                <span className="font-mono text-sm">{row.original.si_number}</span>
            ) : (
                <Badge variant="secondary">Belum terbit</Badge>
            ),
    },
    {
        accessorKey: 'recommendation_type',
        header: 'Jenis Rekom',
        cell: ({ row }) => {
            const option = RecommendationTypeOptions.find(
                (opt) => opt.value === row.original.recommendation_type,
            );
            return <Badge variant="outline">{option?.label || row.original.recommendation_type || '-'}</Badge>;
        },
    },
    {
        accessorKey: 'applicant',
        header: 'Perusahaan',
        cell: ({ row }) =>
            row.original.applicant?.organization?.name || row.original.applicant?.display_name || '-',
    },
    {
        accessorKey: 'parent_permit',
        header: 'SI Induk',
        cell: ({ row }) => {
            const parent = row.original.parent_permit;
            if (!parent) return '-';
            return (
                <span className="font-mono text-sm">
                    {parent.si_number || parent.permit_number || `#${parent.id}`}
                </span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = PermitStatusOptions.find((opt) => opt.value === row.original.status);
            return (
                <Badge
                    variant={
                        (status?.variant as 'secondary' | 'destructive' | 'outline' | 'default') || 'default'
                    }
                >
                    {status?.label || row.original.status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'valid_from',
        header: 'Berlaku Dari',
        cell: ({ row }) => {
            if (!row.original.valid_from) return '-';
            return new Date(row.original.valid_from).toLocaleDateString('id-ID');
        },
    },
    {
        accessorKey: 'valid_to',
        header: 'Berlaku Hingga',
        cell: ({ row }) => {
            if (!row.original.valid_to) return '-';
            return new Date(row.original.valid_to).toLocaleDateString('id-ID');
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsCell key={row.original.id} row={row} />,
    },
];
