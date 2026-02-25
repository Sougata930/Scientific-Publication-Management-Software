import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2, Microscope, BookOpen, FileText } from 'lucide-react';

const OperatorHome = () => {
    const { user } = useAuth();
    const { researchers, offices, labEquipments, journalIssues, researchPapers } = useData();

    const stats = [
        { label: 'Researchers', value: researchers.length, icon: Users },
        { label: 'Offices', value: offices.length, icon: Building2 },
        { label: 'Equipment', value: labEquipments.length, icon: Microscope },
        { label: 'Journal Issues', value: journalIssues.length, icon: BookOpen },
        { label: 'Research Papers', value: researchPapers.length, icon: FileText },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="page-header">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mb-6">Use the sidebar to manage institute data.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map(s => (
                    <Card key={s.label} className="stat-card">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <s.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-heading">{s.value}</p>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default OperatorHome;
