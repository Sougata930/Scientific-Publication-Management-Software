import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface PaperDraft {
    id: number;
    title: string;
    authorEmpIds: number[];
    leadAuthorEmpId: number | null;
}

const AddJournal = () => {
    const {
        researchers,
        journalIssues,
        researchPapers,
        authors,
        addJournalIssue,
        addResearchPaper,
        addAuthor,
    } = useData();

    const [volId, setVolId] = useState('');
    const [title, setTitle] = useState('');
    const [pubDate, setPubDate] = useState('');
    const [format, setFormat] = useState('');
    const [editorEmpId, setEditorEmpId] = useState('');
    const [papers, setPapers] = useState<PaperDraft[]>([]);
    const [editingVolId, setEditingVolId] = useState<number | null>(null);

    // ---------- Generate next Paper ID ----------
    const nextPaperId = () => {
        const existing = researchPapers.map(p => p.Paper_id);
        const drafts = papers.map(p => p.id);
        const all = [...existing, ...drafts];
        return all.length ? Math.max(...all) + 1 : 1;
    };

    const addPaperDraft = () => {
        setPapers(prev => [...prev, {
            id: nextPaperId(),
            title: '',
            authorEmpIds: [],
            leadAuthorEmpId: null
        }]);
    };

    const removePaperDraft = (idx: number) => {
        setPapers(prev => prev.filter((_, i) => i !== idx));
    };

    const updatePaper = (idx: number, updates: Partial<PaperDraft>) => {
        setPapers(prev => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));
    };

    const toggleAuthor = (paperIdx: number, empId: number) => {
        const paper = papers[paperIdx];
        const has = paper.authorEmpIds.includes(empId);
        const newIds = has
            ? paper.authorEmpIds.filter(id => id !== empId)
            : [...paper.authorEmpIds, empId];

        const newLead = has && paper.leadAuthorEmpId === empId
            ? null
            : paper.leadAuthorEmpId;

        updatePaper(paperIdx, { authorEmpIds: newIds, leadAuthorEmpId: newLead });
    };

    // ---------- EDIT JOURNAL ----------
    const handleEdit = (journalId: number) => {
        const journal = journalIssues.find(j => j.Volume_identifier === journalId);
        if (!journal) return;

        setEditingVolId(journalId);
        setVolId(String(journal.Volume_identifier));
        setTitle(journal.Title);
        setPubDate(journal.Publication_date);
        setFormat(journal.Format);
        setEditorEmpId(String(journal.Emp_id));

        const relatedPapers = researchPapers.filter(p => p.Volume_Identifier === journalId);

        const drafts: PaperDraft[] = relatedPapers.map(p => {
            const paperAuthors = authors.filter(a => a.Paper_id === p.Paper_id);
            return {
                id: p.Paper_id,
                title: p.Title,
                authorEmpIds: paperAuthors.map(a => a.Emp_id),
                leadAuthorEmpId: paperAuthors.find(a => a.Is_LeadAuthor)?.Emp_id ?? null,
            };
        });

        setPapers(drafts);
    };

    // ---------- SUBMIT ----------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vid = parseInt(volId);

        if (!editingVolId && journalIssues.some(j => j.Volume_identifier === vid)) {
            toast({ title: 'Error', description: 'Volume identifier exists', variant: 'destructive' });
            return;
        }

        for (const p of papers) {
            if (!p.title || p.authorEmpIds.length === 0 || !p.leadAuthorEmpId) {
                toast({
                    title: 'Error',
                    description: 'Each paper needs title, authors & lead',
                    variant: 'destructive'
                });
                return;
            }
        }

        if (!editingVolId) {
            addJournalIssue({
                Volume_identifier: vid,
                Title: title,
                Publication_date: pubDate,
                Format: format,
                Emp_id: parseInt(editorEmpId),
            });
        }

        papers.forEach(p => {
            addResearchPaper({ Paper_id: p.id, Title: p.title, Volume_Identifier: vid });

            p.authorEmpIds.forEach(empId => {
                addAuthor({
                    Emp_id: empId,
                    Paper_id: p.id,
                    Is_LeadAuthor: empId === p.leadAuthorEmpId,
                });
            });
        });

        toast({
            title: editingVolId ? 'Updated' : 'Created',
            description: `Journal "${title}" saved`,
        });

        setEditingVolId(null);
        setVolId('');
        setTitle('');
        setPubDate('');
        setFormat('');
        setEditorEmpId('');
        setPapers([]);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* ================= FORM ================= */}
            <div>
                <h1 className="page-header">
                    {editingVolId ? 'Edit Journal Issue' : 'Add Journal Issue'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="form-card space-y-5">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Volume Identifier</Label>
                                <Input type="number" value={volId} onChange={e => setVolId(e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Publication Date</Label>
                                <Input type="date" value={pubDate} onChange={e => setPubDate(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Print">Print</SelectItem>
                                        <SelectItem value="Online">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Editor</Label>
                                <Select value={editorEmpId} onValueChange={setEditorEmpId}>
                                    <SelectTrigger><SelectValue placeholder="Select Editor" /></SelectTrigger>
                                    <SelectContent>
                                        {researchers.map(r => (
                                            <SelectItem key={r.Emp_id} value={String(r.Emp_id)}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* ================= PAPERS ================= */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <h2 className="text-lg font-semibold">Research Papers</h2>
                            <Button type="button" size="sm" variant="outline" onClick={addPaperDraft}>
                                <Plus className="h-4 w-4 mr-1" /> Add Paper
                            </Button>
                        </div>

                        {papers.map((paper, idx) => (
                            <Card key={idx}>
                                <CardHeader className="flex justify-between">
                                    <CardTitle>Paper #{paper.id}</CardTitle>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removePaperDraft(idx)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-3">

                                    <Input
                                        placeholder="Paper title"
                                        value={paper.title}
                                        onChange={e => updatePaper(idx, { title: e.target.value })}
                                    />

                                    <div className="border rounded p-3 max-h-40 overflow-auto space-y-2">
                                        {researchers.map(r => (
                                            <div key={r.Emp_id} className="flex items-center gap-3">

                                                <Checkbox
                                                    checked={paper.authorEmpIds.includes(r.Emp_id)}
                                                    onCheckedChange={() => toggleAuthor(idx, r.Emp_id)}
                                                />

                                                <span className="flex-1 text-sm">{r.name}</span>

                                                {paper.authorEmpIds.includes(r.Emp_id) && (
                                                    <input
                                                        type="radio"
                                                        checked={paper.leadAuthorEmpId === r.Emp_id}
                                                        onChange={() => updatePaper(idx, { leadAuthorEmpId: r.Emp_id })}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button className="w-full">
                        {editingVolId ? 'Update Journal Issue' : 'Create Journal Issue'}
                    </Button>
                </form>
            </div>

            {/* ================= JOURNAL CARDS ================= */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Journal Issues</h2>

                {journalIssues.map(j => (
                    <Card key={j.Volume_identifier}>
                        <CardHeader className="flex justify-between items-center">
                            <div>
                                <CardTitle>{j.Title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Vol {j.Volume_identifier} • {j.Format} • {j.Publication_date}
                                </p>
                            </div>

                            <Button size="sm" variant="outline" onClick={() => handleEdit(j.Volume_identifier)}>
                                Edit
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <b>Papers:</b>
                            <ul className="list-disc ml-5">
                                {researchPapers
                                    .filter(p => p.Volume_Identifier === j.Volume_identifier)
                                    .map(p => (
                                        <li key={p.Paper_id}>{p.Title}</li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    );
};

export default AddJournal;