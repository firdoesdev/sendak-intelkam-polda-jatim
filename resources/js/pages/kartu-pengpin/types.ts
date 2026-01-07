export type TKartuPengpin = {
    id: number;
    pengpin_number: string;
    permit_id: number;
    person_id: number;
    weapon_id: number;
    issue_date: string;
    expiry_date: string;
    job_title: string;
    home_address: string;
    buku_pas_reference: string | null;
    status: 'active' | 'expired' | 'revoked' | 'suspended';
    status_label: string;
    status_variant: string;
    is_expired: boolean;
    is_active: boolean;
    revoked_at: string | null;
    revoked_by: number | null;
    revoke_reason: string | null;
    created_at: string;
    updated_at: string;
    permit: {
        id: number;
        permit_number: string;
        permit_type: string;
    };
    person: {
        id: number;
        full_name: string;
        national_id: string;
        job_title: string;
        address: string;
    };
    weapon: {
        id: number;
        serial_number: string;
        name: string;
        manufacturer: string;
        caliber: string;
    };
    revoked_by_user?: {
        id: number;
        name: string;
    };
    // Backward compatibility
    card_number?: string;
    issued_at?: string;
    expired_at?: string;
}