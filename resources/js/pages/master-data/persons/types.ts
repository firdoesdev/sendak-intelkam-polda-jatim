import type { TPerson } from "@/types/entities/person";
export type { TPerson } from "@/types/entities/person";
import { Row } from "@tanstack/react-table";

export type TDialogProps = {
    row: Row<TPerson>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumGender {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

export const GenderOptions = [
    { label: 'Laki-laki', value: EnumGender.MALE },
    { label: 'Perempuan', value: EnumGender.FEMALE },
    { label: 'Tidak Diketahui', value: EnumGender.UNKNOWN },
];
