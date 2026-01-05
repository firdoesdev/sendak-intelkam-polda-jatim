# API Endpoints Reference - HTTP Layer

## 📄 Permit Documents

### Upload Document
```http
POST /permits/{permit}/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "document_type": "ktp",  // DocumentType enum
  "document": File (max 2MB, pdf|jpg|jpeg|png)
}

Response 302: Redirect back with success message
Response 422: Validation errors
```

### Download Document
```http
GET /documents/{document}/download
Authorization: Bearer {token}

Response 200: File download
Response 404: File not found
```

### Delete Document
```http
DELETE /documents/{document}
Authorization: Bearer {token}

Response 302: Redirect back with success message
Response 422: Error if deletion fails
```

---

## 🔫 Weapon Hibah Transfers

### List All Hibah Transfers
```http
GET /weapons/hibah-transfers
Authorization: Bearer {token}

Response 200: Inertia page with paginated transfers
Returns: transfers (with weapon, fromPerson, fromPermit, toPerson, toPermit, requestedBy, approvedBy)
```

### Show Transfer Details
```http
GET /weapons/hibah-transfers/{transfer}
Authorization: Bearer {token}

Response 200: Inertia page with transfer details and activity log
```

### Create Hibah Transfer Request
```http
POST /weapons/hibah-transfers
Authorization: Bearer {token}
Content-Type: application/json

{
  "weapon_id": 1,
  "from_person_id": 10,
  "from_permit_id": 5,
  "to_person_id": 20,
  "to_permit_id": 8,
  "transfer_reason": "Hibah kepada anggota keluarga"
}

Response 302: Redirect to show page with success message
Response 422: Validation errors
```

### Submit Transfer for Approval
```http
POST /weapons/hibah-transfers/{transfer}/submit
Authorization: Bearer {token}

Requirements: transfer.status must be 'draft'

Response 302: Redirect back with success message
Response 422: Error if status is not draft
```

### Approve/Reject Transfer
```http
POST /weapons/hibah-transfers/{transfer}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "approve",  // or "reject"
  "notes": "Optional approval/rejection notes (max 1000 chars)"
}

Requirements: transfer.status must be 'pending'

Response 302: Redirect back with success message
Response 422: Validation or status errors

On approve:
- Generates request_number (HIBAH-YYYYMM-XXXX)
- Updates weapon ownership
- Creates ownership history
- Closes previous ownership

On reject:
- Sets status to rejected
- Records rejection notes
```

---

## 🎫 Kartu Pengpin (POLSUS)

### List All Kartu Pengpin
```http
GET /kartu-pengpin
Authorization: Bearer {token}

Response 200: Inertia page with paginated kartu pengpin
Returns: kartuPengpin (with permit, person, weapon)
```

### Show Kartu Pengpin Details
```http
GET /kartu-pengpin/{kartuPengpin}
Authorization: Bearer {token}

Response 200: Inertia page with details and activity log
```

### Generate Kartu Pengpin
```http
POST /kartu-pengpin
Authorization: Bearer {token}
Content-Type: application/json

{
  "permit_id": 1,
  "person_id": 10,
  "weapon_id": 5,
  "issued_at": "2026-01-05",
  "expired_at": "2027-01-05"
}

Requirements:
- Permit must be POLSUS type
- Combination of permit+person+weapon must be unique
- expired_at must be after issued_at

Response 302: Redirect to show page with success message
Response 422: Validation errors

Auto-generates: pengpin_number (PENGPIN-YYYYMM-XXXX)
```

### Print Kartu Pengpin
```http
GET /kartu-pengpin/{kartuPengpin}/print
Authorization: Bearer {token}

Response 200: Inertia print page (print-friendly layout)
```

### Revoke Kartu Pengpin
```http
POST /kartu-pengpin/{kartuPengpin}/revoke
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Alasan pencabutan (required, max 500 chars)"
}

Requirements: status must be 'active'

Response 302: Redirect back with success message
Response 422: Error if not active
```

---

## 📋 Route Summary

### Permit Document Routes (3)
```
POST   /permits/{permit}/documents          → permits.documents.store
GET    /documents/{document}/download       → documents.download
DELETE /documents/{document}                → documents.destroy
```

### Kartu Pengpin Routes (5)
```
GET    /kartu-pengpin                       → kartu-pengpin.index
POST   /kartu-pengpin                       → kartu-pengpin.store
GET    /kartu-pengpin/{kartuPengpin}        → kartu-pengpin.show
GET    /kartu-pengpin/{kartuPengpin}/print  → kartu-pengpin.print
POST   /kartu-pengpin/{kartuPengpin}/revoke → kartu-pengpin.revoke
```

### Weapon Hibah Routes (5)
```
GET    /weapons/hibah-transfers                  → weapons.hibah-transfers.index
POST   /weapons/hibah-transfers                  → weapons.hibah-transfers.store
GET    /weapons/hibah-transfers/{transfer}       → weapons.hibah-transfers.show
POST   /weapons/hibah-transfers/{transfer}/submit → weapons.hibah-transfers.submit
POST   /weapons/hibah-transfers/{transfer}/approve → weapons.hibah-transfers.approve
```

**Total: 13 new routes**

---

## 🔒 Middleware

All routes require:
- `auth` - User must be authenticated
- `verified` - Email must be verified

---

## 📝 Validation Rules

### PermitDocumentRequest
```php
document_type: required|string|enum:DocumentType
document: required|file|max:2048|mimes:pdf,jpg,jpeg,png
```

### WeaponHibahTransferRequest
```php
weapon_id: required|exists:weapons,id
from_person_id: required|exists:persons,id
from_permit_id: required|exists:permits,id
to_person_id: required|exists:persons,id
to_permit_id: required|exists:permits,id
transfer_reason: required|string|max:500
```

### ApproveHibahTransferRequest
```php
action: required|in:approve,reject
notes: nullable|string|max:1000
```

### GenerateKartuPengpinRequest
```php
permit_id: required|exists:permits,id
person_id: required|exists:persons,id
weapon_id: required|exists:weapons,id
issued_at: required|date
expired_at: required|date|after:issued_at
```

---

## 🚀 Usage Examples

### JavaScript/TypeScript (Inertia)
```typescript
import { router } from '@inertiajs/react'

// Upload document
router.post(`/permits/${permitId}/documents`, {
  document_type: 'ktp',
  document: file
})

// Create hibah transfer
router.post('/weapons/hibah-transfers', {
  weapon_id: 1,
  from_person_id: 10,
  from_permit_id: 5,
  to_person_id: 20,
  to_permit_id: 8,
  transfer_reason: 'Hibah kepada anggota keluarga'
})

// Approve transfer
router.post(`/weapons/hibah-transfers/${transfer.id}/approve`, {
  action: 'approve',
  notes: 'Dokumen lengkap, disetujui'
})

// Generate Kartu Pengpin
router.post('/kartu-pengpin', {
  permit_id: 1,
  person_id: 10,
  weapon_id: 5,
  issued_at: '2026-01-05',
  expired_at: '2027-01-05'
})
```

### cURL Examples
```bash
# Upload document
curl -X POST http://localhost/permits/1/documents \
  -H "Authorization: Bearer {token}" \
  -F "document_type=ktp" \
  -F "document=@/path/to/ktp.pdf"

# Create hibah transfer
curl -X POST http://localhost/weapons/hibah-transfers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "weapon_id": 1,
    "from_person_id": 10,
    "from_permit_id": 5,
    "to_person_id": 20,
    "to_permit_id": 8,
    "transfer_reason": "Hibah kepada anggota keluarga"
  }'

# Download document
curl -X GET http://localhost/documents/123/download \
  -H "Authorization: Bearer {token}" \
  --output document.pdf

# Generate Kartu Pengpin
curl -X POST http://localhost/kartu-pengpin \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "permit_id": 1,
    "person_id": 10,
    "weapon_id": 5,
    "issued_at": "2026-01-05",
    "expired_at": "2027-01-05"
  }'
```

---

## 🎨 Inertia Pages Required

The following React pages need to be created:

### Document Management (none - handled inline)
- Document upload can be inline component in permit form
- Download/delete via buttons with route links

### Hibah Transfers (3 pages)
```
resources/js/pages/Weapons/HibahTransfers/
├── Index.tsx          // List all transfers
├── Show.tsx           // Transfer details with approval form
└── (Form component)   // Create transfer form (can be in Index or separate)
```

### Kartu Pengpin (3 pages)
```
resources/js/pages/Permits/KartuPengpin/
├── Index.tsx          // List all kartu pengpin
├── Show.tsx           // Kartu pengpin details
└── Print.tsx          // Print-friendly view
```

---

## ⚠️ Business Rules Enforced

### Document Upload
- ✅ Max file size: 2MB
- ✅ Allowed formats: PDF, JPG, JPEG, PNG
- ✅ Document type must be valid enum
- ✅ Uploader tracked automatically

### Hibah Transfer
- ✅ Draft → Pending → Approved/Rejected workflow
- ✅ Only draft can be submitted
- ✅ Only pending can be approved/rejected
- ✅ Auto-generates request number on approval
- ✅ Updates weapon ownership atomically
- ✅ Creates ownership history chain
- ✅ Database transaction ensures integrity

### Kartu Pengpin
- ✅ Only POLSUS permits allowed
- ✅ Unique combination: permit+person+weapon
- ✅ Expired date must be after issued date
- ✅ Auto-generates pengpin number
- ✅ Only active cards can be revoked
- ✅ Revocation reason required

---

## 🔐 Security Considerations

### Authorization
Controllers use `authorize()` method (returns true for now). Add permission checks:
```php
public function authorize(): bool
{
    return $this->user()->can('upload-permit-documents');
}
```

### File Upload Security
- ✅ File size limit enforced (2MB)
- ✅ MIME type validation
- ✅ Private storage disk (not web-accessible)
- ⚠️ TODO: Add virus scanning
- ⚠️ TODO: Add rate limiting

### Database Security
- ✅ Foreign key validation via `exists` rules
- ✅ Enum validation via `Rule::enum()`
- ✅ Transaction wrapping for critical operations
- ✅ Automatic user tracking via Auth::id()

---

## 📊 Response Formats

### Success Response
```php
// Redirect with flash message
return back()->with('success', 'Operasi berhasil');

// Or redirect to specific route
return redirect()
    ->route('kartu-pengpin.show', $kartuPengpin)
    ->with('success', 'Kartu Pengpin berhasil diterbitkan');
```

### Error Response
```php
// Validation errors (422)
return back()->withErrors(['field' => 'Error message']);

// Custom errors
return back()->withErrors(['general' => 'Operasi gagal']);
```

### Inertia Response
```php
return Inertia::render('Page/Component', [
    'data' => $data,
    'otherProp' => $value
]);
```

---

## 🧪 Testing Endpoints

All routes are protected with `auth` and `verified` middleware. To test:

1. **Create authenticated user**:
```php
$user = User::factory()->create();
$this->actingAs($user);
```

2. **Test route**:
```php
$response = $this->post('/kartu-pengpin', [
    'permit_id' => $permit->id,
    'person_id' => $person->id,
    'weapon_id' => $weapon->id,
    'issued_at' => now()->format('Y-m-d'),
    'expired_at' => now()->addYear()->format('Y-m-d'),
]);

$response->assertRedirect();
$response->assertSessionHas('success');
```

3. **Add tests to existing test files or create controller tests**
