import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Office {
    Phone_extension: string;
    Address: string;
}

export interface Researcher {
    Emp_id: number;
    name: string;
    Phone_extension: string;
}

export interface LabEquipment {
    Item_no: number;
    Name: string;
    Primary_Calibration_Standard: string;
}

export interface Skilled {
    Emp_id: number;
    Item_no: number;
}

export interface JournalIssue {
    Volume_identifier: number;
    Publication_date: string;
    Title: string;
    Format: string;
    Emp_id: number;
}

export interface ResearchPaper {
    Paper_id: number;
    Title: string;
    Volume_Identifier: number;
}

export interface Author {
    Emp_id: number;
    Paper_id: number;
    Is_LeadAuthor: boolean;
}

interface DataContextType {
    offices: Office[];
    researchers: Researcher[];
    labEquipments: LabEquipment[];
    skilled: Skilled[];
    journalIssues: JournalIssue[];
    researchPapers: ResearchPaper[];
    authors: Author[];
    addOffice: (o: Office) => void;
    addResearcher: (r: Researcher) => void;
    addLabEquipment: (e: LabEquipment) => void;
    addSkilled: (s: Skilled) => void;
    addJournalIssue: (j: JournalIssue) => void;
    addResearchPaper: (p: ResearchPaper) => void;
    addAuthor: (a: Author) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'spms_data';


// ---------- SEED DATA ----------
const SEED = {
    offices: [
        { Phone_extension: '1001', Address: 'Building A, Room 101' },
        { Phone_extension: '1002', Address: 'Building A, Room 205' },
        { Phone_extension: '1003', Address: 'Building B, Room 310' },
    ],
    researchers: [
        { Emp_id: 101, name: 'Dr. Alice Smith', Phone_extension: '1001' },
        { Emp_id: 102, name: 'Dr. Bob Chen', Phone_extension: '1001' },
        { Emp_id: 103, name: 'Dr. Carol Davis', Phone_extension: '1002' },
    ],
    labEquipments: [
        { Item_no: 1, Name: 'Electron Microscope', Primary_Calibration_Standard: 'ISO 17025' },
        { Item_no: 2, Name: 'Gas Chromatograph', Primary_Calibration_Standard: 'NIST-Traceable' },
        { Item_no: 3, Name: 'Spectrophotometer', Primary_Calibration_Standard: 'ISO 17025' },
    ],
    skilled: [
        { Emp_id: 101, Item_no: 1 },
        { Emp_id: 101, Item_no: 2 },
        { Emp_id: 102, Item_no: 2 },
        { Emp_id: 103, Item_no: 3 },
    ],
    journalIssues: [
        { Volume_identifier: 1, Publication_date: '2024-01-15', Title: 'Advances in Materials Science', Format: 'Print', Emp_id: 101 },
        { Volume_identifier: 2, Publication_date: '2024-06-01', Title: 'Computational Methods Quarterly', Format: 'Online', Emp_id: 101 },
        { Volume_identifier: 3, Publication_date: '2025-01-10', Title: 'Biomedical Research Review', Format: 'Online', Emp_id: 103 },
    ],
    researchPapers: [
        { Paper_id: 1, Title: 'Novel Nanomaterial Synthesis Approaches', Volume_Identifier: 1 },
        { Paper_id: 2, Title: 'Machine Learning for Protein Folding', Volume_Identifier: 1 },
        { Paper_id: 3, Title: 'Efficient Graph Algorithms', Volume_Identifier: 2 },
        { Paper_id: 4, Title: 'CRISPR Gene Editing Advances', Volume_Identifier: 3 },
    ],
    authors: [
        { Emp_id: 101, Paper_id: 1, Is_LeadAuthor: true },
        { Emp_id: 102, Paper_id: 1, Is_LeadAuthor: false },
        { Emp_id: 102, Paper_id: 2, Is_LeadAuthor: true },
        { Emp_id: 101, Paper_id: 3, Is_LeadAuthor: true },
        { Emp_id: 103, Paper_id: 4, Is_LeadAuthor: true },
        { Emp_id: 101, Paper_id: 4, Is_LeadAuthor: false },
    ],
};


export const DataProvider = ({ children }: { children: ReactNode }) => {

    // ---------- LOAD FROM LOCALSTORAGE ----------
    const loadData = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : SEED;
        } catch {
            return SEED;
        }
    };

    const [data, setData] = useState(loadData);

    // ---------- SAVE TO LOCALSTORAGE ----------
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // ---------- ADD FUNCTIONS ----------
    const addOffice = (o: Office) =>
        setData(prev => ({ ...prev, offices: [...prev.offices, o] }));

    const addResearcher = (r: Researcher) =>
        setData(prev => ({ ...prev, researchers: [...prev.researchers, r] }));

    const addLabEquipment = (e: LabEquipment) =>
        setData(prev => ({ ...prev, labEquipments: [...prev.labEquipments, e] }));

    const addSkilled = (s: Skilled) =>
        setData(prev => ({ ...prev, skilled: [...prev.skilled, s] }));

    const addJournalIssue = (j: JournalIssue) =>
        setData(prev => ({ ...prev, journalIssues: [...prev.journalIssues, j] }));

    const addResearchPaper = (p: ResearchPaper) =>
        setData(prev => ({ ...prev, researchPapers: [...prev.researchPapers, p] }));

    const addAuthor = (a: Author) =>
        setData(prev => ({ ...prev, authors: [...prev.authors, a] }));


    return (
        <DataContext.Provider value={{
            ...data,
            addOffice,
            addResearcher,
            addLabEquipment,
            addSkilled,
            addJournalIssue,
            addResearchPaper,
            addAuthor,
        }}>
            {children}
        </DataContext.Provider>
    );
};


export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used within DataProvider');
    return ctx;
};