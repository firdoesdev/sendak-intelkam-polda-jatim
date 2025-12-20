import type { TOrganization } from "@/types/entities/organization";
export type { TOrganization } from "@/types/entities/organization";
import { Row } from "@tanstack/react-table";


export type TDialogProps = {
    row: Row<TOrganization>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumOrgType {
    COMPANY = 'company',
    CLUB = 'club',
    GOVERNMENT = 'government',
    OTHER = 'other',
}

export const OrgTypeOptions = [
    { label: 'Perusahaan', value: EnumOrgType.COMPANY },
    { label: 'Klub', value: EnumOrgType.CLUB },
    { label: 'Pemerintah', value: EnumOrgType.GOVERNMENT },
    { label: 'Lainnya', value: EnumOrgType.OTHER },
];
