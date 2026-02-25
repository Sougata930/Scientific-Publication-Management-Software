import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const AddEquipment = () => {
    const { labEquipments, addLabEquipment } = useData();
    const [itemNo, setItemNo] = useState('');
    const [name, setName] = useState('');
    const [standard, setStandard] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const no = parseInt(itemNo);

        if (labEquipments.some(e => e.Item_no === no)) {
            toast({
                title: 'Error',
                description: 'Item number already exists',
                variant: 'destructive',
            });
            return;
        }

        addLabEquipment({
            Item_no: no,
            Name: name,
            Primary_Calibration_Standard: standard,
        });

        toast({
            title: 'Success',
            description: `Equipment "${name}" added`,
        });

        setItemNo('');
        setName('');
        setStandard('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ---------- FORM ---------- */}
            <div>
                <h1 className="page-header">Add Lab Equipment</h1>

                <form onSubmit={handleSubmit} className="form-card space-y-5">
                    <div className="space-y-2">
                        <Label>Item Number</Label>
                        <Input
                            type="number"
                            value={itemNo}
                            onChange={e => setItemNo(e.target.value)}
                            required
                            placeholder="e.g. 4"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Equipment Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Mass Spectrometer"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Primary Calibration Standard</Label>
                        <Input
                            value={standard}
                            onChange={e => setStandard(e.target.value)}
                            required
                            placeholder="e.g. ISO 17025"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Add Equipment
                    </Button>
                </form>
            </div>

            {/* ---------- TABLE ---------- */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Equipment List</h2>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Calibration Standard</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {labEquipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        No equipment added yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                labEquipments.map((eq) => (
                                    <TableRow key={eq.Item_no}>
                                        <TableCell>{eq.Item_no}</TableCell>
                                        <TableCell>{eq.Name}</TableCell>
                                        <TableCell>{eq.Primary_Calibration_Standard}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
};

export default AddEquipment;