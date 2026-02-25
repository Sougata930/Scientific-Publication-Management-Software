import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const AddResearcher = () => {
    const { offices, researchers, addResearcher } = useData();
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(empId);

        if (researchers.some(r => r.Emp_id === id)) {
            toast({
                title: 'Error',
                description: 'Employee ID already exists',
                variant: 'destructive'
            });
            return;
        }

        addResearcher({ Emp_id: id, name, Phone_extension: phone });

        toast({
            title: 'Success',
            description: `Researcher "${name}" added successfully`
        });

        setEmpId('');
        setName('');
        setPhone('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ---------- FORM ---------- */}
            <div>
                <h1 className="page-header">Add Researcher</h1>

                <form onSubmit={handleSubmit} className="form-card space-y-5">

                    <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input
                            type="number"
                            value={empId}
                            onChange={e => setEmpId(e.target.value)}
                            required
                            placeholder="e.g. 104"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="Dr. John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Office (Phone Extension)</Label>
                        <Select value={phone} onValueChange={setPhone} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an office" />
                            </SelectTrigger>
                            <SelectContent>
                                {offices.map(o => (
                                    <SelectItem key={o.Phone_extension} value={o.Phone_extension}>
                                        {o.Address} (Ext: {o.Phone_extension})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full">
                        Add Researcher
                    </Button>

                </form>
            </div>

            {/* ---------- TABLE ---------- */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Researchers List</h2>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone Extension</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {researchers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        No researchers added yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                researchers.map((r) => (
                                    <TableRow key={r.Emp_id}>
                                        <TableCell>{r.Emp_id}</TableCell>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{r.Phone_extension}</TableCell>
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

export default AddResearcher;