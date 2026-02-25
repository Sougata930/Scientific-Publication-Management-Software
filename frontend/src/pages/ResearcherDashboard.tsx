import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, FileText, BookOpen, Microscope } from 'lucide-react';

const ResearcherDashboard = () => {
    const { user } = useAuth();
    const { researchers, offices, authors, researchPapers, journalIssues, labEquipments, skilled } = useData();

    const empId = user?.empId;
    const researcher = researchers.find(r => r.Emp_id === empId);
    const office = offices.find(o => o.Phone_extension === researcher?.Phone_extension);

    const myPapers = authors
        .filter(a => a.Emp_id === empId)
        .map(a => {
            const paper = researchPapers.find(p => p.Paper_id === a.Paper_id);
            const journal = paper ? journalIssues.find(j => j.Volume_identifier === paper.Volume_Identifier) : null;
            return { ...a, paper, journal };
        });

    const editedJournals = journalIssues.filter(j => j.Emp_id === empId);
    const myEquipment = skilled.filter(s => s.Emp_id === empId).map(s => labEquipments.find(e => e.Item_no === s.Item_no)).filter(Boolean);

    if (!researcher) return <div className="text-center text-muted-foreground mt-20">Researcher profile not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="page-header">My Dashboard</h1>

            {/* Personal Info */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="font-heading">{researcher.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Employee ID: {researcher.Emp_id}</p>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Office:</span> {office?.Address}</div>
                    <div><span className="text-muted-foreground">Phone Ext:</span> {researcher.Phone_extension}</div>
                </CardContent>
            </Card>

            {/* Equipment Skills */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2"><Microscope className="h-5 w-5" /> Equipment Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {myEquipment.length === 0 ? <p className="text-muted-foreground text-sm">No equipment assigned</p> :
                        myEquipment.map(e => e && <Badge key={e.Item_no} variant="secondary">{e.Name}</Badge>)}
                </CardContent>
            </Card>

            {/* Papers */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2"><FileText className="h-5 w-5" /> Research Papers</CardTitle>
                </CardHeader>
                <CardContent>
                    {myPapers.length === 0 ? <p className="text-muted-foreground text-sm">No papers authored</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Paper Title</TableHead>
                                    <TableHead>Journal</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myPapers.map(({ paper, journal, Is_LeadAuthor }) => (
                                    <TableRow key={paper?.Paper_id}>
                                        <TableCell>{paper?.Title}</TableCell>
                                        <TableCell>{journal?.Title}</TableCell>
                                        <TableCell>
                                            <Badge variant={Is_LeadAuthor ? 'default' : 'outline'}>
                                                {Is_LeadAuthor ? 'Lead Author' : 'Co-Author'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edited Journals */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2"><BookOpen className="h-5 w-5" /> Editor-in-Chief</CardTitle>
                </CardHeader>
                <CardContent>
                    {editedJournals.length === 0 ? <p className="text-muted-foreground text-sm">Not editor of any journals</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Journal Title</TableHead>
                                    <TableHead>Volume</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Format</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {editedJournals.map(j => (
                                    <TableRow key={j.Volume_identifier}>
                                        <TableCell>{j.Title}</TableCell>
                                        <TableCell>Vol. {j.Volume_identifier}</TableCell>
                                        <TableCell>{j.Publication_date}</TableCell>
                                        <TableCell><Badge variant="outline">{j.Format}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResearcherDashboard;
