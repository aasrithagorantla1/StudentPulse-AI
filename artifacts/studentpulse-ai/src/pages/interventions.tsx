import { useMemo, useState } from 'react';
import { CalendarClock, ClipboardPlus, HeartHandshake, MessageCircleMore } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AddInterventionDialog, PageHeader, Panel, SampleNotice, StatusBadge } from '@/components/workspace';
import { useStudentData } from '@/data/student-data';

const followUpTrend = [
  { period: 'Jan', scheduled: 13, completed: 8, open: 5 },
  { period: 'Feb', scheduled: 17, completed: 12, open: 5 },
  { period: 'Mar', scheduled: 15, completed: 10, open: 5 },
  { period: 'Apr', scheduled: 19, completed: 13, open: 6 },
];

export default function Interventions() {
  const { interventions, students } = useStudentData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const types = Array.from(new Set(interventions.map((item) => item.type)));
  const filtered = useMemo(() => interventions.filter((item) => (statusFilter === 'all' || item.status === statusFilter) && (typeFilter === 'all' || item.type === typeFilter)), [interventions, statusFilter, typeFilter]);
  const activeCount = interventions.filter((item) => item.status !== 'Completed').length;
  const completedCount = interventions.filter((item) => item.status === 'Completed').length;
  return <section className="workspace-page" data-testid="page-interventions">
    <PageHeader eyebrow="STUDENT CARE" title="Interventions" description="Coordinate sample support records and keep follow-up dates visible for the team." action={<button className="button primary" onClick={() => setDialogOpen(true)} data-testid="button-add-intervention"><ClipboardPlus size={15} />Add intervention</button>} />
    <div className="layout-three">
      <div className="panel mini-stat"><strong>{interventions.length}</strong><span>Total demonstration support records</span></div>
      <div className="panel mini-stat"><strong>{activeCount}</strong><span>Scheduled or in progress · sample list</span></div>
      <div className="panel mini-stat"><strong>{completedCount}</strong><span>Completed · sample list only</span></div>
    </div>
    <div className="layout-two">
      <Panel title="Support records" subtitle={`${filtered.length} demonstration records shown`}>
        <div className="toolbar">
          <select className="control" aria-label="Filter intervention status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} data-testid="filter-intervention-status"><option value="all">All statuses</option><option>Scheduled</option><option>In progress</option><option>Completed</option></select>
          <select className="control" aria-label="Filter support type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} data-testid="filter-intervention-type"><option value="all">All support types</option>{types.map((type) => <option key={type}>{type}</option>)}</select>
        </div>
        {filtered.length ? <div className="table-wrap"><table className="data-table" data-testid="table-interventions"><thead><tr><th>Student</th><th>Support type</th><th>Mentor</th><th>Follow-up</th><th>Status</th></tr></thead><tbody>
          {filtered.map((record) => {
            const student = students.find((entry) => entry.id === record.studentId);
            return <tr key={record.id} data-testid={`row-intervention-${record.id}`}>
              <td data-label="Student"><div className="table-person"><span className="initials">{student?.name.split(' ').map((part) => part[0]).join('') ?? 'ST'}</span><span><span className="person-name">{student?.name ?? 'Sample student'}</span><span className="person-id">{record.studentId}</span></span></div></td>
              <td data-label="Support type">{record.type}</td><td data-label="Mentor">{record.mentor}</td><td data-label="Follow-up">{record.followUpDate}</td><td data-label="Status"><StatusBadge status={record.status} /></td>
            </tr>;
          })}
        </tbody></table></div> : <div className="empty-state"><HeartHandshake size={24} /><h3>No support records match</h3><p>Change a filter or add a new demonstration intervention.</p><button className="button small" style={{ marginTop: 12 }} onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }} data-testid="button-clear-intervention-filters">Clear filters</button></div>}
        <p className="section-subtitle" style={{ marginTop: 12 }}>Mentors, students, dates, and support types are fictional examples.</p>
      </Panel>
      <Panel title="Follow-up rhythm" subtitle="Illustrative aggregate support activity by month">
        <div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-1))' }} />Completed sample</span><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-2))' }} />Open sample</span></div>
        <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={followUpTrend} margin={{ top: 7, right: 6, left: -23, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="completed" name="Completed" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} /><Bar dataKey="open" name="Open" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        </BarChart></ResponsiveContainer></div>
        <p className="section-subtitle">Static illustrative counts. This chart does not summarize the records above.</p>
      </Panel>
    </div>
    <Panel title="Before / after preview" subtitle="Example of how a support plan might be framed for discussion">
      <div className="comparison-grid">
        <div className="comparison-card"><span className="demo-tag">Illustrative starting point</span><h3>Check-in cadence</h3><strong>1 × monthly</strong><p className="section-subtitle">Fictional planning example before a support conversation.</p></div>
        <div className="comparison-card after"><span className="demo-tag">Illustrative follow-up</span><h3>Check-in cadence</h3><strong>1 × fortnightly</strong><p className="section-subtitle">Example follow-up plan after a support conversation.</p></div>
      </div>
      <SampleNotice>Illustrative preview only. It is not a measured outcome, intervention effect, or prediction about a student.</SampleNotice>
    </Panel>
    <div className="list-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}><CalendarClock size={13} /><MessageCircleMore size={13} />Use a follow-up conversation to agree on next steps; no action is automated.</div>
    <AddInterventionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
  </section>;
}
