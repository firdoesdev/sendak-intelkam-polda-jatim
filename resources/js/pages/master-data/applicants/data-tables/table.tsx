import DataTable from '@/components/data-table';
import applicants from '@/routes/master-data/applicants';
import { PaginationMeta } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { columns } from './columns';
import { TApplicant } from '../types';
import { CreateApplicantForm } from '../forms/create-form-dialog';

const ApplicantDataTable = () => {
    const page = usePage<{ data: PaginationMeta<TApplicant> }>();

    const handleSearch = (search: string) => {
        router.visit(applicants.index({ mergeQuery: { search: search } }), {
            preserveState: true,
            replace: true,
            only: ['data'],
        });
    };

    return (
        <DataTable<TApplicant>
            onSearch={handleSearch}
            title="Data Pemohon"
            columns={columns}
            data={page.props.data.data}
            topActions={[<CreateApplicantForm key="add-applicant" />]}
        />
    );
};

export default ApplicantDataTable;
