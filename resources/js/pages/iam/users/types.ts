import type { TUser } from '@/types/entities/user';
export type { TUser } from '@/types/entities/user';
import { Row } from '@tanstack/react-table';

export type TDialogProps = {
    row: Row<TUser>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};
