export type TKartuPengpin = {
    id: number;
    card_number: string;
    permit_id: number;
    person_id: number;
    weapon_id: number;
    issued_at: string;
    expired_at: string;
    status: string;
    status_label: string;
    status_variant: string;
    revoked_at: string | null;
    revoked_by: number | null;
    revoke_reason: string | null;
    created_at: string;
    permit: {
        id: number;
        permit_number: string;
        permit_type: string;
    };
    person: {
        id: number;
        name: string;
        nik: string;
    };
    weapon: {
        id: number;
        serial_number: string;
        brand: string;
        model: string;
    };
}