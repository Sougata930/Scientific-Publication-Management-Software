import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const COLORS = ['hsl(215, 60%, 22%)', 'hsl(35, 80%, 55%)'];

const ReportDigital = () => {
    const { journalIssues } = useData();

    const printCount = journalIssues.filter(j => j.Format === 'Print').length;
    const onlineCount = journalIssues.filter(j => j.Format === 'Online').length;
    const total = journalIssues.length;

    const pieData = [
        { name: 'Print', value: printCount },
        { name: 'Online', value: onlineCount },
    ];

    // By year
    const byYear = journalIssues.reduce<Record<string, { print: number; online: number }>>((acc, j) => {
        const year = j.Publication_date.substring(0, 4);
        if (!acc[year]) acc[year] = { print: 0, online: 0 };
        if (j.Format === 'Print') acc[year].print++;
        else acc[year].online++;
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="page-header">Digital Publishing Shift</h1>
            <p className="text-muted-foreground -mt-4 mb-4">Track the institute's transition toward digital publishing</p>

            <div className="grid grid-cols-3 gap-4">
                <div className="stat-card text-center">
                    <p className="text-3xl font-bold font-heading">{total}</p>
                    <p className="text-sm text-muted-foreground">Total Issues</p>
                </div>
                <div className="stat-card text-center">
                    <p className="text-3xl font-bold font-heading">{onlineCount}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                </div>
                <div className="stat-card text-center">
                    <p className="text-3xl font-bold font-heading">{printCount}</p>
                    <p className="text-sm text-muted-foreground">Print</p>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle className="font-heading">Format Distribution</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="font-heading">Year-wise Breakdown</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead>Print</TableHead>
                                <TableHead>Online</TableHead>
                                <TableHead>Digital %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(byYear).sort().map(([year, { print, online }]) => (
                                <TableRow key={year}>
                                    <TableCell>{year}</TableCell>
                                    <TableCell>{print}</TableCell>
                                    <TableCell>{online}</TableCell>
                                    <TableCell>
                                        <Badge variant={online > print ? 'default' : 'outline'}>
                                            {((online / (print + online)) * 100).toFixed(0)}%
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

export default ReportDigital;
