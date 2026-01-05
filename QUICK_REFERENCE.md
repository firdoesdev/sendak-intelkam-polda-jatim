# Quick Reference Guide - New Features

## File Locations

### Models
```
app/Models/
├── PermitDocument.php           # Document attachments
├── TestResult.php                # Health/psychology/shooting tests
├── WeaponOwnershipHistory.php   # Weapon ownership chain
├── WeaponHibahTransferRequest.php # Hibah approval workflow
├── KartuPengpin.php              # POLSUS weapon cards
├── OrganizationRepresentative.php # Representative tracking
└── ExplosivesMaterial.php        # HANDAK materials
```

### Actions
```
app/Actions/
├── Permits/
│   ├── UploadPermitDocument.php     # Upload docs (2MB limit)
│   └── GenerateKartuPengpin.php     # POLSUS cards
└── Weapons/
    ├── RequestWeaponHibahTransfer.php  # Initiate transfer
    └── ApproveWeaponHibahTransfer.php  # Approve/reject
```

### Services
```
app/Services/
└── PermitValidationService.php   # Warning system
```

### Tests
```
tests/Feature/
├── TestResultTest.php (7 tests)
├── WeaponHibahTest.php (5 tests)
├── KartuPengpinTest.php (4 tests)
├── HandakPermitTest.php (6 tests)
├── PermitDocumentTest.php (4 tests)
└── OrganizationRepresentativeTest.php (3 tests)
```

---

## Common Usage Patterns

### 1. Upload Document to Permit
```php
use App\Actions\Permits\UploadPermitDocument;

$action = new UploadPermitDocument();
$document = $action->execute(
    permit: $permit,
    documentType: 'ktp', 
    file: $request->file('document')
);

// Delete document
$action->delete($document);
```

### 2. Check Person Credentials
```php
use App\Services\PermitValidationService;

$service = new PermitValidationService();
$warnings = $service->validatePersonCredentials($person, 'SENPI');

// Returns array like:
// ['KTP number is required', 'Buku PAS has expired']
```

### 3. Request Weapon Hibah Transfer
```php
use App\Actions\Weapons\RequestWeaponHibahTransfer;
use App\Actions\Weapons\ApproveWeaponHibahTransfer;

// Create request
$requestAction = new RequestWeaponHibahTransfer();
$transferRequest = $requestAction->execute(
    weapon: $weapon,
    fromOwner: $currentOwner,
    fromPermit: $currentPermit,
    toOwner: $newOwner,
    toPermit: $newPermit,
    transferReason: 'Donation to family member'
);

// Submit for approval
$requestAction->submit($transferRequest);

// Approve
$approveAction = new ApproveWeaponHibahTransfer();
$approveAction->approve($transferRequest, 'Approved by commander');
// Auto-generates: HIBAH-202601-0001

// Or reject
$approveAction->reject($transferRequest, 'Missing documents');
```

### 4. Generate Kartu Pengpin (POLSUS)
```php
use App\Actions\Permits\GenerateKartuPengpin;

$action = new GenerateKartuPengpin();
$kartu = $action->execute(
    permit: $polsusPermit,
    person: $user,
    weapon: $weapon,
    issuedAt: now(),
    expiredAt: now()->addYear()
);
// Auto-generates: PENGPIN-202601-0001

// Revoke if needed
$action->revoke($kartu, 'User transferred to another unit');
```

### 5. Check Warehouse Capacity (HANDAK)
```php
use App\Services\PermitValidationService;

$service = new PermitValidationService();
$warnings = $service->validateHandakWarehouseCapacity(
    warehouse: $warehouse,
    additionalWeight: 50.5 // kg
);

// Returns warnings like:
// ['Warehouse will exceed capacity: 105.0 kg / 100.0 kg (105.0% full)']
```

### 6. Query Test Results
```php
// Check if person has all valid tests
if ($person->has_valid_test_results) {
    // All 3 tests (health, psychology, shooting) are valid
}

// Get only valid test results
$validTests = $person->testResults()->valid()->get();

// Check specific credential expiry
if ($person->is_buku_pas_expired) {
    // Buku PAS needs renewal
}

if ($person->is_kartu_ikhsa_expired) {
    // Kartu Ikhsa needs renewal
}
```

### 7. Track Weapon Ownership
```php
// Get current owner
$currentOwnership = $weapon->ownershipHistory()
    ->whereNull('owned_to')
    ->first();

// Get full ownership chain
$history = $weapon->ownershipHistory()
    ->with(['ownerPerson', 'permit'])
    ->orderBy('owned_from', 'desc')
    ->get();

// Check if weapon was received via hibah
if ($weapon->acquisition_type === 'hibah') {
    $previousOwner = $weapon->previousOwner; // Person model
    $previousPermit = $weapon->previousOwnerPermit; // Permit model
    $transferDate = $weapon->transfer_date;
}
```

### 8. Manage Organization Representatives
```php
// Get current representative
$current = $organization->representatives()->current()->first();

// Or using accessor
if ($rep->is_current) {
    // This is the active representative
}

// Change representative
$oldRep->update(['active_to' => now()]);
$newRep = OrganizationRepresentative::create([
    'organization_id' => $organization->id,
    'person_id' => $newPerson->id,
    'position' => 'Director',
    'active_from' => now(),
    'active_to' => null, // null = current
]);
```

### 9. HANDAK Permit with Materials
```php
// Create HANDAK permit
$permit = Permit::create([
    'permit_type' => 'HANDAK',
    'recommendation_type' => 'P1', // Auto-valid for 180 days
    'activity_type' => 'storage',
    // ... other fields
]);

// Add explosives materials
$permit->explosivesMaterials()->create([
    'material_name' => 'Dynamite',
    'weight_kg' => 10.5,
    'quantity' => 20,
]);

// Get total weight
$totalWeight = $permit->explosivesMaterials
    ->sum(fn($m) => $m->total_weight); // 210 kg (10.5 * 20)

// Update warehouse load
$warehouse->update([
    'current_load_kg' => $warehouse->current_load_kg + $totalWeight
]);
```

### 10. Activity Log Queries
```php
// Get permit audit trail
$activities = $permit->activities()
    ->with('causer')
    ->orderBy('created_at', 'desc')
    ->get();

foreach ($activities as $activity) {
    echo "{$activity->causer->name} changed {$activity->description}";
    echo "From: " . json_encode($activity->properties['old']);
    echo "To: " . json_encode($activity->properties['attributes']);
}
```

---

## Enum Values

### DocumentType
```php
ktp, npwp, ksk, skep_jabatan, kta, 
import_permit, health_certificate, 
psychology_certificate, shooting_certificate, 
surat_hibah, other
```

### TestType
```php
health, psychology, shooting
```

### RecommendationType (HANDAK)
```php
P1 (180 days), P2 (365 days), 
P3 (90 days), IJIN_GUDANG (730 days)
```

### ActivityType (HANDAK)
```php
storage, usage, application
```

### AcquisitionType (Weapons)
```php
new, hibah, other
```

### TransferType (Ownership History)
```php
hibah, purchase, inheritance, other
```

---

## Database Queries

### Find permits expiring soon
```php
$expiring = Permit::where('valid_to', '<=', now()->addDays(30))
    ->where('valid_to', '>=', now())
    ->where('status', 'approved')
    ->get();
```

### Find persons with expired test results
```php
$expired = Person::whereHas('testResults', function($q) {
    $q->where('expired_at', '<', now());
})->get();
```

### Find Kartu Pengpin expiring this month
```php
$expiring = KartuPengpin::whereBetween('expired_at', [
    now()->startOfMonth(),
    now()->endOfMonth()
])->where('status', 'active')->get();
```

### Find weapons received via hibah
```php
$hibahs = Weapon::where('acquisition_type', 'hibah')
    ->with(['previousOwner', 'previousOwnerPermit'])
    ->get();
```

### Find pending hibah transfer requests
```php
$pending = WeaponHibahTransferRequest::where('status', 'pending')
    ->with(['weapon', 'fromPerson', 'toPerson'])
    ->orderBy('submitted_at', 'desc')
    ->get();
```

### Get warehouse utilization percentage
```php
$warehouses = Warehouse::whereNotNull('capacity_kg')
    ->get()
    ->map(function($w) {
        return [
            'name' => $w->name,
            'utilization' => ($w->current_load_kg / $w->capacity_kg) * 100,
            'remaining' => $w->capacity_kg - $w->current_load_kg,
        ];
    });
```

---

## Testing

### Run all tests
```bash
./vendor/bin/pest
```

### Run specific test file
```bash
./vendor/bin/pest tests/Feature/TestResultTest.php
```

### Run specific test
```bash
./vendor/bin/pest --filter "person can have multiple test results"
```

### Run with coverage (if configured)
```bash
./vendor/bin/pest --coverage
```

---

## Migrations

### Run migrations
```bash
php artisan migrate
```

### Rollback last batch
```bash
php artisan migrate:rollback
```

### Fresh migration (WARNING: deletes all data)
```bash
php artisan migrate:fresh --seed
```

### Check migration status
```bash
php artisan migrate:status
```

---

## Storage

### Create permits directory
```bash
mkdir -p storage/app/permits
chmod 0755 storage/app/permits
```

### Download permit document
```php
return Storage::disk('permits')->download(
    $document->file_path,
    $document->original_filename
);
```

### Check document exists
```php
if (Storage::disk('permits')->exists($document->file_path)) {
    // File exists
}
```

### Delete old documents (1 year+)
```php
$oldDocs = PermitDocument::where('created_at', '<', now()->subYear())->get();
foreach ($oldDocs as $doc) {
    Storage::disk('permits')->delete($doc->file_path);
    $doc->delete();
}
```

---

## Common Validations

### Check all person requirements
```php
$service = new PermitValidationService();

$warnings = array_merge(
    $service->validatePersonCredentials($person, $permitType),
    $service->getPermitExpiryWarnings($existingPermit)
);

if (!empty($warnings)) {
    return response()->json([
        'warnings' => $warnings,
        'can_proceed' => true // warnings don't block
    ]);
}
```

### Validate HANDAK warehouse capacity
```php
$totalWeight = $permit->explosivesMaterials->sum('total_weight');
$warnings = $service->validateHandakWarehouseCapacity($warehouse, $totalWeight);

if (str_contains($warnings[0] ?? '', 'exceed')) {
    // Hard stop - capacity exceeded
    return response()->json(['error' => $warnings[0]], 422);
}
```

### Check unique Kartu Pengpin
```php
$exists = KartuPengpin::where('permit_id', $permit->id)
    ->where('person_id', $person->id)
    ->where('weapon_id', $weapon->id)
    ->exists();

if ($exists) {
    return response()->json(['error' => 'Kartu Pengpin already exists'], 422);
}
```

---

## Tips & Best Practices

1. **Always use actions** for business logic (not controllers)
2. **Check warnings** from PermitValidationService before critical operations
3. **Use database transactions** for multi-step operations (see ApproveWeaponHibahTransfer)
4. **Eager load relationships** to avoid N+1 queries
5. **Test with factories** for consistent data
6. **Log activities** on critical models (use LogsActivity trait)
7. **Validate file sizes** before upload (2MB limit)
8. **Use private disk** for sensitive documents
9. **Check unique constraints** before creating records
10. **Track created_by/updated_by** via actions (not manually)
