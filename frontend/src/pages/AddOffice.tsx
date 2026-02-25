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

const AddOffice = () => {
    const { offices, addOffice } = useData();
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (offices.some(o => o.Phone_extension === phone)) {
            toast({
                title: 'Error',
                description: 'Phone extension already exists',
                variant: 'destructive',
            });
            return;
        }

        addOffice({ Phone_extension: phone, Address: address });

        toast({
            title: 'Success',
            description: `Office at "${address}" added`,
        });

        setPhone('');
        setAddress('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ---------- FORM ---------- */}
            <div>
                <h1 className="page-header">Add Office</h1>

                <form onSubmit={handleSubmit} className="form-card space-y-5">
                    <div className="space-y-2">
                        <Label>Phone Extension</Label>
                        <Input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            placeholder="e.g. 1004"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            placeholder="Building C, Room 102"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Add Office
                    </Button>
                </form>
            </div>

            {/* ---------- TABLE ---------- */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Offices List</h2>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Phone Extension</TableHead>
                                <TableHead>Address</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {offices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                                        No offices added yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                offices.map((o) => (
                                    <TableRow key={o.Phone_extension}>
                                        <TableCell>{o.Phone_extension}</TableCell>
                                        <TableCell>{o.Address}</TableCell>
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

export default AddOffice;