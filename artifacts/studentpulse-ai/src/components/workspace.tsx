import { useEffect, useId, useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useStudentData, departments, reviewStatuses, type Student, type Intervention } from '@/data/student-data';
import { AlertCircle, Check, CircleHelp, Plus, X, type LucideIcon } from 'lucide-react';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading workspace-page">
    <div className="page-eyebrow"><span className="eyebrow-line" />{eyebrow}<span className="demo-tag">Demonstration data</span></div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
      <div><h1>{title}</h1><p className="page-intro">{description}</p></div>
      {action}
    </div>
  </div>;
}

export function Panel({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return <section className={`panel panel-pad ${className}`}>
    <div className="panel-head"><div><h2 className="section-title">{title}</h2>{subtitle && <p className="section-subtitle">{subtitle}</p>}</div></div>
    {children}
  </section>;
}

export function StatCard({ label, value, detail, icon: Icon, tone = 'teal' }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: string }) {
  return <article className="panel stat-card" data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={16} /></span></div>
    <div className="stat-value">{value}</div><div className="stat-foot"><span>{detail}</span><span className="demo-tag">Sample</span></div>
  </article>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><CircleHelp size={25} /><h3>{title}</h3><p>{description}</p></div>;
}

function Modal({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="modal-heading"><div><h2 id={titleId}>{title}</h2><p>{description}</p></div><button type="button" className="icon-button" aria-label="Close form" data-testid="button-close-form" onClick={onClose}><X size={17} /></button></div>
      {children}
    </section>
  </div>;
}

const studentSchema = z.object({
  id: z.string().trim().min(3, 'Enter at least 3 characters').max(18, 'Use 18 characters or fewer'),
  name: z.string().trim().min(2, 'Enter the student name').max(70, 'Use 70 characters or fewer'),
  department: z.string().min(1, 'Choose a department'),
  semester: z.coerce.number().int().min(1, 'Semester must be 1–12').max(12, 'Semester must be 1–12'),
  attendance: z.coerce.number().min(0, 'Attendance must be 0–100').max(100, 'Attendance must be 0–100'),
  averageMarks: z.coerce.number().min(0, 'Average marks must be 0–100').max(100, 'Average marks must be 0–100'),
  reviewStatus: z.enum(['On track', 'Needs review', 'Monitoring']),
});
type StudentValues = z.infer<typeof studentSchema>;

export function AddStudentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { students, addStudent } = useStudentData();
  if (!open) return null;
  return <StudentDialogForm students={students} addStudent={addStudent} onClose={onClose} />;
}

function StudentDialogForm({ students, addStudent, onClose }: { students: Student[]; addStudent: (student: Student) => void; onClose: () => void }) {
  const [formError, setFormError] = useState('');
  const form = useForm<z.input<typeof studentSchema>, unknown, StudentValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { id: '', name: '', department: '', semester: 1, attendance: 80, averageMarks: 75, reviewStatus: 'On track' },
  });
  const errors = form.formState.errors;
  const field = (name: keyof StudentValues, label: string, type: string = 'text', options?: string[]) => (
    <div className="form-field">
      <label htmlFor={`student-${name}`}>{label}</label>
      {options ? <select id={`student-${name}`} className="field-control" data-testid={`input-student-${name}`} {...form.register(name)}><option value="">Choose {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select> :
        <input id={`student-${name}`} className="field-control" type={type} min={type === 'number' ? 0 : undefined} max={name === 'semester' ? 12 : type === 'number' ? 100 : undefined} step={type === 'number' ? 1 : undefined} autoFocus={name === 'id'} data-testid={`input-student-${name}`} {...form.register(name, type === 'number' ? { valueAsNumber: true } : {})} />}
      <span className="field-error" role="alert">{errors[name]?.message as string | undefined}</span>
    </div>
  );
  return <Modal title="Add a student" description="Add a demonstration record to this browser session. It will be lost on refresh." onClose={onClose}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => {
        const normalizedId = values.id.trim().toUpperCase();
        if (students.some((student) => student.id.toLowerCase() === normalizedId.toLowerCase())) { setFormError('That student ID is already in this demonstration list.'); return; }
        addStudent({ ...values, id: normalizedId, name: values.name.trim(), skills: [] });
        onClose();
      })}>
        <div className="form-grid">
          {field('id', 'Student ID')}
          {field('name', 'Full name')}
          {field('department', 'Department', 'text', departments)}
          {field('semester', 'Semester', 'number')}
          {field('attendance', 'Attendance (%)', 'number')}
          {field('averageMarks', 'Average marks (%)', 'number')}
          {field('reviewStatus', 'Review status', 'text', reviewStatuses)}
        </div>
        {formError && <p className="field-error" role="alert" style={{ marginTop: 8 }}>{formError}</p>}
        <div className="modal-actions"><button className="button" type="button" onClick={onClose} data-testid="button-cancel-student">Cancel</button><button className="button primary" type="submit" data-testid="button-submit-student"><Plus size={14} />Add demonstration student</button></div>
      </form>
    </Form>
  </Modal>;
}

const interventionSchema = z.object({
  studentId: z.string().min(1, 'Choose a student'),
  type: z.string().trim().min(2, 'Enter a support type').max(60, 'Use 60 characters or fewer'),
  mentor: z.string().trim().min(2, 'Enter a mentor name').max(70, 'Use 70 characters or fewer'),
  followUpDate: z.string().min(1, 'Choose a follow-up date'),
  status: z.enum(['Scheduled', 'In progress', 'Completed']),
});
type InterventionValues = z.infer<typeof interventionSchema>;

export function AddInterventionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { students, addIntervention, interventions } = useStudentData();
  if (!open) return null;
  return <InterventionDialogForm students={students} addIntervention={addIntervention} interventions={interventions} onClose={onClose} />;
}

function InterventionDialogForm({ students, addIntervention, interventions, onClose }: { students: Student[]; addIntervention: (record: Intervention) => void; interventions: Intervention[]; onClose: () => void }) {
  const form = useForm<InterventionValues>({
    resolver: zodResolver(interventionSchema),
    defaultValues: { studentId: '', type: '', mentor: '', followUpDate: '', status: 'Scheduled' },
  });
  const errors = form.formState.errors;
  const currentDate = new Date().toISOString().slice(0, 10);
  return <Modal title="Add an intervention" description="Create a sample support follow-up for this browser session." onClose={onClose}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => {
        addIntervention({ ...values, type: values.type.trim(), mentor: values.mentor.trim(), id: `IV-${String(31 + interventions.length).padStart(3, '0')}` });
        onClose();
      })}>
        <div className="form-grid">
          <div className="form-field full"><label htmlFor="intervention-student">Student</label><select id="intervention-student" autoFocus className="field-control" data-testid="input-intervention-student" {...form.register('studentId')}><option value="">Choose a student</option>{students.map((student) => <option value={student.id} key={student.id}>{student.name} · {student.id}</option>)}</select><span className="field-error" role="alert">{errors.studentId?.message}</span></div>
          <div className="form-field"><label htmlFor="intervention-type">Support type</label><input id="intervention-type" className="field-control" placeholder="Academic coaching" data-testid="input-intervention-type" {...form.register('type')} /><span className="field-error" role="alert">{errors.type?.message}</span></div>
          <div className="form-field"><label htmlFor="intervention-mentor">Mentor</label><input id="intervention-mentor" className="field-control" placeholder="Mentor name" data-testid="input-intervention-mentor" {...form.register('mentor')} /><span className="field-error" role="alert">{errors.mentor?.message}</span></div>
          <div className="form-field"><label htmlFor="intervention-date">Follow-up date</label><input id="intervention-date" className="field-control" type="date" min={currentDate} data-testid="input-intervention-follow-up-date" {...form.register('followUpDate')} /><span className="field-error" role="alert">{errors.followUpDate?.message}</span></div>
          <div className="form-field"><label htmlFor="intervention-status">Status</label><select id="intervention-status" className="field-control" data-testid="input-intervention-status" {...form.register('status')}><option>Scheduled</option><option>In progress</option><option>Completed</option></select><span className="field-error" role="alert">{errors.status?.message}</span></div>
        </div>
        <div className="modal-actions"><button className="button" type="button" onClick={onClose} data-testid="button-cancel-intervention">Cancel</button><button className="button primary" type="submit" data-testid="button-submit-intervention"><Check size={14} />Save demonstration record</button></div>
      </form>
    </Form>
  </Modal>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === 'Needs review' ? 'danger' : status === 'Monitoring' || status === 'Scheduled' ? 'warning' : status === 'Completed' || status === 'On track' ? '' : 'blue';
  return <span className={`badge ${tone}`} data-testid={`status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>;
}

export function SampleNotice({ children }: { children: ReactNode }) {
  return <div className="comparison-note" data-testid="illustrative-notice"><AlertCircle size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />{children}</div>;
}
