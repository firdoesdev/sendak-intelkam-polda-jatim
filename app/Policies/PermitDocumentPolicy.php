<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PermitDocument;
use App\Models\Permit;

class PermitDocumentPolicy
{
    /**
     * Determine whether the user can view the document.
     */
    public function view(User $user, PermitDocument $document): bool
    {
        // All authenticated users can view/download
        // In production, you might want to restrict based on permit ownership
        return true;
    }

    /**
     * Determine whether the user can create documents for permit.
     */
    public function create(User $user, Permit $permit): bool
    {
        // Users with permission can upload documents
        // Optionally: check if user is permit owner/creator
        return $user->can('manage_permit_documents') 
            || $permit->created_by === $user->id;
    }

    /**
     * Determine whether the user can delete the document.
     */
    public function delete(User $user, PermitDocument $document): bool
    {
        // Only uploader or users with permission can delete
        return $document->uploaded_by === $user->id 
            || $user->can('manage_permit_documents');
    }
}
