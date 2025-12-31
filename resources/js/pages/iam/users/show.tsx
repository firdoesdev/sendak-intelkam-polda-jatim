import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TUser, TRole } from '@/types/entities/user';
import users from '@/routes/iam/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ManageRolesDialog } from './dialogs/manage-roles-dialog';

type PageProps = {
    user: TUser;
    allRoles: TRole[];
};

const UserShowPage = () => {
    const { user, allRoles } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: users.index().url,
        },
        {
            title: user.name,
            href: users.show({ user: user.id }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>Basic information about this user</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Name
                                </label>
                                <p className="text-lg font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email
                                </label>
                                <p className="text-lg">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </label>
                                <p className="text-sm">
                                    {new Date(user.created_at).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Roles</CardTitle>
                                    <CardDescription>
                                        Roles assigned to this user
                                    </CardDescription>
                                </div>
                                <ManageRolesDialog user={user} allRoles={allRoles} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {user.roles && user.roles.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary">
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No roles assigned yet
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default UserShowPage;
