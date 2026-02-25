import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ReportOccupancy = () => {
    const { offices, researchers } = useData();

    const data = offices.map(o => {
        const occupants = researchers.filter(r => r.Phone_extension === o.Phone_extension);
        return { ...o, occupants, count: occupants.length };
    }).sort((a, b) => b.count - a.count);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="page-header">Office Occupancy Report</h1>
            <p className="text-muted-foreground -mt-4 mb-4">Identify offices with high occupancy for facilities management</p>

            <Card>
                <CardHeader><CardTitle className="font-heading">Occupancy Chart</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <XAxis dataKey="Address" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" name="Researchers" radius={[4, 4, 0, 0]}>
                                {data.map((_, i) => (
                                    <Cell key={i} fill={data[i].count >= 2 ? 'hsl(0, 72%, 50%)' : 'hsl(215, 60%, 22%)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="font-heading">Details</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Office Address</TableHead>
                                <TableHead>Phone Ext</TableHead>
                                <TableHead>Occupants</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map(o => (
                                <TableRow key={o.Phone_extension}>
                                    <TableCell>{o.Address}</TableCell>
                                    <TableCell>{o.Phone_extension}</TableCell>
                                    <TableCell>
                                        {o.occupants.map(r => r.name).join(', ') || 'Empty'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={o.count >= 2 ? 'destructive' : 'secondary'}>
                                            {o.count >= 2 ? 'High' : o.count === 1 ? 'Normal' : 'Vacant'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportOccupancy;
