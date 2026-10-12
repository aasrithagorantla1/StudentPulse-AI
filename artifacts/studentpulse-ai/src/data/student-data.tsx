import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ReviewStatus = 'On track' | 'Needs review' | 'Monitoring';
export type Student = {
  id: string;
  name: string;
  department: string;
  semester: number;
  attendance: number;
  averageMarks: number;
  reviewStatus: ReviewStatus;
  skills: string[];
};
export type Intervention = {
  id: string;
  studentId: string;
  type: string;
  mentor: string;
  followUpDate: string;
  status: 'Scheduled' | 'In progress' | 'Completed';
};

const initialStudents: Student[] = [
  { id: 'SP-24018', name: 'Maya Bennett', department: 'Computer Science', semester: 5, attendance: 78, averageMarks: 72, reviewStatus: 'Needs review', skills: ['Python', 'SQL', 'Problem solving'] },
  { id: 'SP-24031', name: 'Ethan Okafor', department: 'Business Analytics', semester: 6, attendance: 91, averageMarks: 84, reviewStatus: 'On track', skills: ['Excel', 'Communication', 'SQL', 'Research'] },
  { id: 'SP-24042', name: 'Leila Haddad', department: 'Computer Science', semester: 4, attendance: 83, averageMarks: 77, reviewStatus: 'Monitoring', skills: ['JavaScript', 'Teamwork', 'Presentation'] },
  { id: 'SP-24057', name: 'Noah Kim', department: 'Electrical Engineering', semester: 7, attendance: 69, averageMarks: 68, reviewStatus: 'Needs review', skills: ['Circuit design', 'Python', 'Teamwork'] },
  { id: 'SP-24063', name: 'Aarav Patel', department: 'Business Analytics', semester: 5, attendance: 95, averageMarks: 89, reviewStatus: 'On track', skills: ['SQL', 'Excel', 'Communication', 'Data visualization'] },
  { id: 'SP-24074', name: 'Sofia Alvarez', department: 'Psychology', semester: 6, attendance: 86, averageMarks: 81, reviewStatus: 'Monitoring', skills: ['Research', 'Communication', 'Presentation'] },
  { id: 'SP-24089', name: 'Jordan Ellis', department: 'Computer Science', semester: 3, attendance: 74, averageMarks: 70, reviewStatus: 'Needs review', skills: ['Python', 'Git', 'Problem solving'] },
  { id: 'SP-24102', name: 'Priya Nair', department: 'Electrical Engineering', semester: 6, attendance: 89, averageMarks: 80, reviewStatus: 'On track', skills: ['Circuit design', 'CAD', 'Teamwork', 'Python'] },
];

const initialInterventions: Intervention[] = [
  { id: 'IV-031', studentId: 'SP-24018', type: 'Academic coaching', mentor: 'Dr. Evelyn Brooks', followUpDate: '2025-04-18', status: 'In progress' },
  { id: 'IV-032', studentId: 'SP-24057', type: 'Attendance check-in', mentor: 'Marcus Lee', followUpDate: '2025-04-20', status: 'Scheduled' },
  { id: 'IV-033', studentId: 'SP-24089', type: 'Peer study referral', mentor: 'Dr. Evelyn Brooks', followUpDate: '2025-04-22', status: 'Completed' },
  { id: 'IV-034', studentId: 'SP-24042', type: 'Career readiness', mentor: 'Nina Coleman', followUpDate: '2025-04-24', status: 'Scheduled' },
];

type StoreValue = {
  students: Student[];
  interventions: Intervention[];
  addStudent: (student: Student) => void;
  addIntervention: (intervention: Intervention) => void;
};
const DataContext = createContext<StoreValue | null>(null);

export function StudentDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState(initialStudents);
  const [interventions, setInterventions] = useState(initialInterventions);
  const value = useMemo(() => ({
    students,
    interventions,
    addStudent: (student: Student) => setStudents((current) => [student, ...current]),
    addIntervention: (intervention: Intervention) => setInterventions((current) => [intervention, ...current]),
  }), [students, interventions]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useStudentData() {
  const value = useContext(DataContext);
  if (!value) throw new Error('useStudentData must be used inside StudentDataProvider');
  return value;
}

export const departments = ['Computer Science', 'Business Analytics', 'Electrical Engineering', 'Psychology', 'Health Sciences', 'Liberal Arts'];
export const reviewStatuses: ReviewStatus[] = ['On track', 'Needs review', 'Monitoring'];
