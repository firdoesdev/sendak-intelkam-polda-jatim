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
import { TUser, TRole } from '@/types/entities/user';

type ManageRolesDialogProps = {
    user: TUser;
    allRoles: TRole[];
};

export const ManageRolesDialog = ({ user, allRoles }: ManageRolesDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<number[]>(
        user.roles?.map((r) => r.id) || []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleRole = (roleId: number) => {
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        router.post(
            `/iam/users/${user.id}/roles`,
            {
                role_ids: selectedRoles,
            },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Roles updated successfully');
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to update roles');
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
                    Manage Roles
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto" aria-describedby="manage-roles-description">
                <DialogHeader>
                    <DialogTitle>Manage Roles for "{user.name}"</DialogTitle>
                    <DialogDescription id="manage-roles-description">
                        Select roles to assign to this user
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {allRoles.length > 0 ? (
                        <div className="grid gap-3">
                            {allRoles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent"
                                >
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={selectedRoles.includes(role.id)}
                                        onCheckedChange={() => handleToggleRole(role.id)}
                                    />
                                    <Label
                                        htmlFor={`role-${role.id}`}
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        {role.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            No roles available
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
