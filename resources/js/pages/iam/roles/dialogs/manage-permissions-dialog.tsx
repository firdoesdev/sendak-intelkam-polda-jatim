import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TPermission, TRole } from '../types';
import RoleController from '@/actions/App/Http/Controllers/IAM/RoleController';

type ManagePermissionsDialogProps = {
    role: TRole;
    allPermissions: TPermission[];
};

export const ManagePermissionsDialog = ({ role, allPermissions }: ManagePermissionsDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        role.permissions?.map((p) => p.id) || []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTogglePermission = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        router.post(
            `/iam/roles/${role.id}/permissions`,
            {
                permission_ids: selectedPermissions,
            },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Permissions updated successfully');
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to update permissions');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4" />
                    Manage Permissions
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto" aria-describedby="manage-permissions-description">
                <DialogHeader>
                    <DialogTitle>Manage Permissions for "{role.name}"</DialogTitle>
                    <DialogDescription id="manage-permissions-description">
                        Select permissions to assign to this role
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {allPermissions.length > 0 ? (
                        <div className="grid gap-3">
                            {allPermissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent"
                                >
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onCheckedChange={() =>
                                            handleTogglePermission(permission.id)
                                        }
                                    />
                                    <Label
                                        htmlFor={`permission-${permission.id}`}
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        {permission.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            No permissions available
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
