import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Building2, ShieldCheck, UsersRound } from 'lucide-react';
import { PageHeader, Panel, SampleNotice } from '@/components/workspace';

const difficultyData = [
  { subject: 'Applied mathematics', signal: 31 }, { subject: 'Data structures', signal: 27 },
  { subject: 'Research methods', signal: 19 }, { subject: 'Technical writing', signal: 13 },
];
const skillGapData = [
  { skill: 'Data visualization', gap: 37 }, { skill: 'Interview practice', gap: 29 },
  { skill: 'Portfolio evidence', gap: 24 }, { skill: 'Team communication', gap: 16 },
];
const followupData = [
  { month: 'Jan', completed: 8, due: 13 }, { month: 'Feb', completed: 12, due: 16 },
  { month: 'Mar', completed: 10, due: 15 }, { month: 'Apr', completed: 14, due: 18 },
  { month: 'May', completed: 13, due: 17 },
];

export default function CollegeInsights() {
  const [cohort, setCohort] = useState('all');
  const suppressed = cohort === 'small';
  return <section className="workspace-page" data-testid="page-college-insights">
    <PageHeader eyebrow="COLLEGE PERSPECTIVE" title="College insights" description="Illustrative cohort-level themes for planning conversations. This page contains aggregate examples only—never student names or row-level records." />
    <div className="layout-two insights-overview">
      <Panel title="Privacy-aware view" subtitle="Select a demonstration aggregation scenario">
        <div className="filter-row">
          <div className="form-field" style={{ minWidth: 220 }}><label htmlFor="insights-cohort">Illustrative cohort scenario</label><select id="insights-cohort" className="field-control" value={cohort} onChange={(event) => setCohort(event.target.value)} data-testid="filter-insights-cohort"><option value="all">All sample programs · 24 records</option><option value="small">Small sample group · 4 records</option></select></div>
          <span className="demo-tag"><UsersRound size={12} /> Fabricated aggregate examples</span>
        </div>
      </Panel>
      <div className="panel panel-pad" style={{ background: '#edf3ed' }} data-testid="privacy-suppression-rule">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><ShieldCheck size={18} color="hsl(var(--primary))" /><strong className="list-title">Illustrative suppression rule</strong></div>
        <p className="section-subtitle" style={{ marginTop: 9 }}>For this demo only, groups smaller than 6 records are suppressed. The rule is an example, not an approved college privacy standard.</p>
      </div>
    </div>
    {suppressed ? <div className="layout-three" data-testid="suppressed-insights">
      {['Subject difficulties', 'Placement skill gaps', 'Intervention follow-up'].map((title) => <Panel key={title} title={title} subtitle="No category detail shown">
        <div className="empty-state"><ShieldCheck size={24} /><h3>Suppressed for small group</h3><p>This illustrative group contains 4 records. Detail is hidden under the example threshold of 6.</p></div>
      </Panel>)}
    </div> : <>
      <div className="layout-two">
        <Panel title="Subject difficulty themes" subtitle="Illustrative share of sample cohort indicating added practice needs">
          <div className="chart-box tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={difficultyData} layout="vertical" margin={{ top: 6, right: 12, left: 10, bottom: 3 }}>
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis type="number" domain={[0, 40]} unit="%" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><YAxis type="category" dataKey="subject" width={120} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="signal" name="Illustrative share" fill="hsl(var(--chart-1))" radius={[0, 5, 5, 0]} barSize={14} />
          </BarChart></ResponsiveContainer></div>
          <p className="section-subtitle">Subject labels and percentages are fabricated examples, not a campus measure.</p>
        </Panel>
        <Panel title="Placement skill gaps" subtitle="Illustrative share of sample profiles not listing these skills">
          <div className="chart-box tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={skillGapData} layout="vertical" margin={{ top: 6, right: 12, left: 10, bottom: 3 }}>
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis type="number" domain={[0, 45]} unit="%" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><YAxis type="category" dataKey="skill" width={120} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="gap" name="Illustrative share" fill="hsl(var(--chart-3))" radius={[0, 5, 5, 0]} barSize={14} />
          </BarChart></ResponsiveContainer></div>
          <p className="section-subtitle">Skills and rates are fictional examples of aggregate themes.</p>
        </Panel>
      </div>
      <Panel title="Intervention follow-up trends" subtitle="Illustrative monthly counts of completed and planned follow-ups">
        <div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-1))' }} />Completed</span><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-2))' }} />Planned / due</span></div>
        <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={followupData} margin={{ top: 6, right: 9, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Line type="monotone" dataKey="completed" name="Completed" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="due" name="Planned / due" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart></ResponsiveContainer></div>
      </Panel>
    </>}
    <SampleNotice>All values on this page are fabricated aggregate examples. No live college data is connected; do not use these visuals to make institutional decisions.</SampleNotice>
    <div className="list-meta" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 7 }}><Building2 size={14} />No student-level details or names are displayed on this page.</div>
  </section>;
}
