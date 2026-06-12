import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePage } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
    RecommendationTypeOptions,
    ReferenceTypeOptions,
    THandakPageProps,
} from '../types';
import { handakPermitSchema } from './form-schema';

type THandakPermitFormValues = z.infer<typeof handakPermitSchema>;

export const HandakPermitFormFields = () => {
    const { applicants, warehouses, materialTypes, parentOptions, stockBalances } =
        usePage<THandakPageProps>().props;
    const form = useFormContext<THandakPermitFormValues>();

    const materialsArray = useFieldArray({ control: form.control, name: 'materials' });
    const referencesArray = useFieldArray({ control: form.control, name: 'references' });

    const recommendationType = useWatch({ control: form.control, name: 'recommendation_type' });
    const applicantId = useWatch({ control: form.control, name: 'applicant_id' });

    const selectedApplicant = applicants.find((applicant) => applicant.id === applicantId);
    const organizationId = selectedApplicant?.organization_id ?? null;

    const today = new Date().toISOString().slice(0, 10);

    // Induk P3: aktif untuk P2, selesai (expired / habis masa berlaku) untuk P1
    const eligibleParents = parentOptions.filter((parent) => {
        if (organizationId && parent.applicant?.organization_id !== organizationId) {
            return false;
        }
        const expired = parent.status === 'expired' || (parent.valid_to !== null && parent.valid_to < today);
        if (recommendationType === 'P2') {
            return parent.status === 'approved' && !expired;
        }
        if (recommendationType === 'P1') {
            return expired;
        }
        return false;
    });

    const organizationBalances = stockBalances.filter(
        (balance) => balance.organization_id === organizationId && Number(balance.balance) > 0,
    );

    return (
        <>
            <FormField
                control={form.control}
                name="recommendation_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jenis Rekom</FormLabel>
                        <FormControl>
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih jenis rekom" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RecommendationTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="applicant_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pemohon (Perusahaan)</FormLabel>
                        <FormControl>
                            <Select
                                value={field.value ? field.value.toString() : ''}
                                onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih pemohon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applicants.map((applicant) => (
                                        <SelectItem key={applicant.id} value={applicant.id.toString()}>
                                            {applicant.display_name}
                                            {applicant.organization && (
                                                <span className="text-muted-foreground ml-2 text-xs">
                                                    ({applicant.organization.name})
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {(recommendationType === 'P1' || recommendationType === 'P2') && (
                <FormField
                    control={form.control}
                    name="parent_permit_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Rekom P3 Induk {recommendationType === 'P2' ? '(masih aktif)' : '(telah selesai)'}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value ? field.value.toString() : ''}
                                    onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih rekom P3 induk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eligibleParents.length === 0 && (
                                            <div className="text-muted-foreground px-2 py-1.5 text-sm">
                                                Tidak ada rekom P3 yang memenuhi syarat
                                            </div>
                                        )}
                                        {eligibleParents.map((parent) => (
                                            <SelectItem key={parent.id} value={parent.id.toString()}>
                                                {parent.si_number || parent.permit_number || `#${parent.id}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {recommendationType === 'P1' && (
                <div className="bg-muted rounded-md p-3 text-sm">
                    <p className="mb-1 font-medium">Sisa stok bahan peledak perusahaan:</p>
                    {organizationBalances.length === 0 ? (
                        <p className="text-muted-foreground">Tidak ada sisa stok tercatat.</p>
                    ) : (
                        <ul className="list-inside list-disc">
                            {organizationBalances.map((balance) => (
                                <li key={`${balance.material_type}-${balance.unit}`}>
                                    {balance.material_type}: {Number(balance.balance).toLocaleString('id-ID')}{' '}
                                    {balance.unit}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {recommendationType === 'IJIN_GUDANG' && (
                <FormField
                    control={form.control}
                    name="warehouse_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gudang Penyimpanan</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value ? field.value.toString() : ''}
                                    onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih gudang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                {warehouse.name} ({warehouse.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {recommendationType === 'IJIN_GUDANG' && (
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="valid_from"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Berlaku Dari</FormLabel>
                                <FormControl>
                                    <Input type="date" value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="valid_to"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Berlaku Hingga</FormLabel>
                                <FormControl>
                                    <Input type="date" value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-muted-foreground col-span-2 -mt-2 text-xs">
                        Masa berlaku Ijin Gudang dinamis, mengikuti rekomendasi instansi terkait (mis. Dinas ESDM).
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="representative_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Perwakilan</FormLabel>
                            <FormControl>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="cth. Widodo Ariawan" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="representative_title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jabatan</FormLabel>
                            <FormControl>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="cth. Direktur" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="representative_nationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Warga Negara</FormLabel>
                            <FormControl>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="Indonesia" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="activity_location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lokasi Kegiatan</FormLabel>
                            <FormControl>
                                <Input
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="cth. Kec. Winongan Kab. Pasuruan"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Peruntukan Kegiatan</FormLabel>
                        <FormControl>
                            <Textarea
                                value={field.value || ''}
                                onChange={field.onChange}
                                placeholder="cth. kegiatan penambangan batu andesit"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FormLabel>Bahan Peledak</FormLabel>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            materialsArray.append({
                                material_type: '',
                                item_name: '',
                                weight: 0,
                                quantity: 1,
                                unit: 'kg',
                                notes: null,
                            })
                        }
                    >
                        <PlusIcon /> Tambah Bahan
                    </Button>
                </div>
                {form.formState.errors.materials?.message && (
                    <p className="text-destructive text-sm">{form.formState.errors.materials.message}</p>
                )}
                {materialsArray.fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="grid grid-cols-12 items-start gap-2 rounded-md border p-2">
                        <FormField
                            control={form.control}
                            name={`materials.${index}.material_type`}
                            render={({ field }) => (
                                <FormItem className="col-span-4">
                                    <FormControl>
                                        <Select
                                            value={field.value || ''}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                const materialType = materialTypes.find((type) => type.name === value);
                                                if (materialType) {
                                                    form.setValue(`materials.${index}.unit`, materialType.default_unit);
                                                    if (!form.getValues(`materials.${index}.item_name`)) {
                                                        form.setValue(`materials.${index}.item_name`, materialType.name);
                                                    }
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Jenis bahan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {materialTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.name}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`materials.${index}.item_name`}
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Input placeholder="Nama item" value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`materials.${index}.weight`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Berat/vol"
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`materials.${index}.quantity`}
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Qty"
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`materials.${index}.unit`}
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormControl>
                                        <Input placeholder="Satuan" value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="col-span-1"
                            onClick={() => materialsArray.remove(index)}
                            disabled={materialsArray.fields.length === 1}
                        >
                            <Trash2Icon className="text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FormLabel>Surat Rujukan</FormLabel>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            referencesArray.append({
                                reference_type: 'company_request',
                                document_number: '',
                                document_date: null,
                                issuer: null,
                                notes: null,
                            })
                        }
                    >
                        <PlusIcon /> Tambah Rujukan
                    </Button>
                </div>
                {referencesArray.fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="grid grid-cols-12 items-start gap-2 rounded-md border p-2">
                        <FormField
                            control={form.control}
                            name={`references.${index}.reference_type`}
                            render={({ field }) => (
                                <FormItem className="col-span-4">
                                    <FormControl>
                                        <Select value={field.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Jenis rujukan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ReferenceTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`references.${index}.document_number`}
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <FormControl>
                                        <Input placeholder="Nomor surat" value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`references.${index}.document_date`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input type="date" value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`references.${index}.issuer`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormControl>
                                        <Input placeholder="Penerbit" value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="col-span-1"
                            onClick={() => referencesArray.remove(index)}
                        >
                            <Trash2Icon className="text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
};
