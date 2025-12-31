import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TPermission, TRole } from './types';
import RoleController from '@/actions/App/Http/Controllers/IAM/RoleController';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ManagePermissionsDialog } from './dialogs/manage-permissions-dialog';

type PageProps = {
    role: TRole;
    allPermissions: TPermission[];
};

const RoleShowPage = () => {
    const { role, allPermissions } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: RoleController.index().url,
        },
        {
            title: role.name,
            href: RoleController.show({ role: role.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                            <CardDescription>Basic information about this role</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Name
                                </label>
                                <p className="text-lg font-semibold">{role.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Guard Name
                                </label>
                                <p className="text-lg">{role.guard_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </label>
                                <p className="text-sm">
                                    {new Date(role.created_at).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        Permissions assigned to this role
                                    </CardDescription>
                                </div>
                                <ManagePermissionsDialog
                                    role={role}
                                    allPermissions={allPermissions}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {role.permissions && role.permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <Badge key={permission.id} variant="secondary">
                                            {permission.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No permissions assigned yet
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default RoleShowPage;
