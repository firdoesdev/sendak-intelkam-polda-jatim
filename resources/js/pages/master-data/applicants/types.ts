import type { TApplicant } from "@/types/entities/applicant";
export type { TApplicant } from "@/types/entities/applicant";
import { Row } from "@tanstack/react-table";

export type TDialogProps = {
    row: Row<TApplicant>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export enum EnumApplicantType {
    PERSON = 'person',
    ORGANIZATION = 'organization',
}

export const ApplicantTypeOptions = [
    { label: 'Perorangan', value: EnumApplicantType.PERSON },
    { label: 'Organisasi', value: EnumApplicantType.ORGANIZATION },
];
