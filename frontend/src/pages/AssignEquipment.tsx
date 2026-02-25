import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const AssignEquipment = () => {
    const { researchers, labEquipments, skilled, addSkilled } = useData();
    const [empId, setEmpId] = useState('');
    const [itemNo, setItemNo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const eid = parseInt(empId);
        const ino = parseInt(itemNo);

        if (!eid || !ino) {
            toast({
                title: 'Error',
                description: 'Please select both researcher and equipment',
                variant: 'destructive',
            });
            return;
        }

        if (skilled.some(s => s.Emp_id === eid && s.Item_no === ino)) {
            toast({
                title: 'Error',
                description: 'This assignment already exists',
                variant: 'destructive',
            });
            return;
        }

        addSkilled({ Emp_id: eid, Item_no: ino });

        toast({
            title: 'Success',
            description: 'Equipment skill assigned',
        });

        setEmpId('');
        setItemNo('');
    };

    const getResearcherName = (id: number) =>
        researchers.find(r => r.Emp_id === id)?.name || 'Unknown';

    const getEquipmentName = (id: number) =>
        labEquipments.find(e => e.Item_no === id)?.Name || 'Unknown';

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ---------- FORM ---------- */}
            <div>
                <h1 className="page-header">Assign Equipment to Researcher</h1>

                <form onSubmit={handleSubmit} className="form-card space-y-5">

                    <div className="space-y-2">
                        <Label>Researcher</Label>
                        <Select value={empId} onValueChange={setEmpId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select researcher" />
                            </SelectTrigger>
                            <SelectContent>
                                {researchers.map(r => (
                                    <SelectItem key={r.Emp_id} value={String(r.Emp_id)}>
                                        {r.name} (ID: {r.Emp_id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Lab Equipment</Label>
                        <Select value={itemNo} onValueChange={setItemNo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                            <SelectContent>
                                {labEquipments.map(e => (
                                    <SelectItem key={e.Item_no} value={String(e.Item_no)}>
                                        {e.Name} (#{e.Item_no})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full">
                        Assign Skill
                    </Button>
                </form>
            </div>

            {/* ---------- TABLE ---------- */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Assigned Skills</h2>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Researcher</TableHead>
                                <TableHead>Equipment</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {skilled.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                                        No assignments yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                skilled.map((s, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{getResearcherName(s.Emp_id)}</TableCell>
                                        <TableCell>{getEquipmentName(s.Item_no)}</TableCell>
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

export default AssignEquipment;