import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ReportEditors = () => {
    const { researchers, journalIssues } = useData();

    const data = researchers.map(r => {
        const edited = journalIssues.filter(j => j.Emp_id === r.Emp_id);
        return { name: r.name, Emp_id: r.Emp_id, count: edited.length, journals: edited };
    }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="page-header">Editor Workload Report</h1>
            <p className="text-muted-foreground -mt-4 mb-4">Identify senior researchers with high editorial responsibilities</p>

            <Card>
                <CardHeader><CardTitle className="font-heading">Journals Edited per Researcher</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" name="Journals Edited" radius={[4, 4, 0, 0]}>
                                {data.map((_, i) => (
                                    <Cell key={i} fill={data[i].count >= 2 ? 'hsl(35, 80%, 55%)' : 'hsl(215, 60%, 22%)'} />
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
                                <TableHead>Researcher</TableHead>
                                <TableHead>Journals Edited</TableHead>
                                <TableHead>Titles</TableHead>
                                <TableHead>Workload</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map(d => (
                                <TableRow key={d.Emp_id}>
                                    <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.count}</TableCell>
                                    <TableCell className="text-sm">{d.journals.map(j => j.Title).join(', ')}</TableCell>
                                    <TableCell>
                                        <Badge variant={d.count >= 2 ? 'destructive' : 'secondary'}>
                                            {d.count >= 2 ? 'Overloaded' : 'Normal'}
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

export default ReportEditors;
