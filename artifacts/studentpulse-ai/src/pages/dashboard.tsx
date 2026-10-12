import { ArrowRight, BookOpenCheck, BriefcaseBusiness, CalendarClock, ChartNoAxesCombined, CircleAlert, ClipboardCheck, UsersRound } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { PageHeader, Panel, StatCard, StatusBadge } from '@/components/workspace';
import { useStudentData } from '@/data/student-data';

const attendanceTrend = [
  { week: 'Wk 1', attendance: 82, progress: 68 }, { week: 'Wk 2', attendance: 79, progress: 71 },
  { week: 'Wk 3', attendance: 84, progress: 74 }, { week: 'Wk 4', attendance: 81, progress: 76 },
  { week: 'Wk 5', attendance: 87, progress: 78 }, { week: 'Wk 6', attendance: 85, progress: 82 },
];
const skillData = [
  { skill: 'Communication', ready: 72 }, { skill: 'Data skills', ready: 61 },
  { skill: 'Teamwork', ready: 84 }, { skill: 'Problem solving', ready: 58 },
];

export default function Dashboard() {
  const { students, interventions } = useStudentData();
  const reviewCount = students.filter((student) => student.reviewStatus === 'Needs review').length;
  const averageAttendance = students.length ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : 0;
  const followUps = interventions.filter((item) => item.status !== 'Completed').slice(0, 3);
  const alerts = students.filter((student) => student.reviewStatus === 'Needs review').slice(0, 3);
  return <section className="workspace-page" data-testid="page-dashboard">
    <PageHeader eyebrow="OVERVIEW" title="Good morning, team." description="A working view of academic momentum, student support, and pathways forward." />
    <div className="stat-grid">
      <StatCard label="Total students" value={String(students.length)} detail="In this sample workspace" icon={UsersRound} />
      <StatCard label="Needs review" value={String(reviewCount)} detail="Sample records flagged for review" icon={CircleAlert} tone="warning" />
      <StatCard label="Average attendance" value={`${averageAttendance}%`} detail="Illustrative roster average" icon={CalendarClock} />
      <StatCard label="Placement readiness" value="68%" detail="Illustrative sample index" icon={BriefcaseBusiness} />
    </div>
    <div className="layout-two">
      <Panel title="Academic pulse" subtitle="Illustrative attendance and progress across six sample weeks">
        <div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ '--legend': 'hsl(var(--chart-1))' } as CSSProperties} />Attendance</span><span className="legend-item"><span className="legend-dot" style={{ '--legend': 'hsl(var(--chart-2))' } as CSSProperties} />Course progress</span></div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={attendanceTrend} margin={{ top: 8, right: 7, left: -22, bottom: 0 }}>
            <defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.18} /><stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 11 }} />
            <Area type="monotone" dataKey="attendance" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#attendanceFill)" /><Area type="monotone" dataKey="progress" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="transparent" />
          </AreaChart></ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Recent review flags" subtitle="Sample records that may benefit from a staff check-in">
        <div className="list-stack">
          {alerts.map((student) => <div className="list-row" key={student.id} data-testid={`alert-student-${student.id}`}>
            <div className="list-icon"><CircleAlert size={15} /></div><div className="list-copy"><p className="list-title">{student.name}</p><p className="list-meta">{student.department} · attendance {student.attendance}%</p></div><StatusBadge status="Needs review" />
          </div>)}
        </div>
        <Link href="/students" className="button small" style={{ marginTop: 16, textDecoration: 'none' }} data-testid="link-review-students">Review student list <ArrowRight size={13} /></Link>
      </Panel>
    </div>
    <div className="layout-two">
      <Panel title="Follow-up queue" subtitle="Illustrative intervention records due for continued attention">
        <div className="list-stack">
          {followUps.map((item) => {
            const student = students.find((entry) => entry.id === item.studentId);
            return <div className="list-row" key={item.id} data-testid={`follow-up-${item.id}`}>
              <div className="list-icon"><ClipboardCheck size={15} /></div><div className="list-copy"><p className="list-title">{item.type} · {student?.name ?? 'Student record'}</p><p className="list-meta">{item.mentor} · follow-up {item.followUpDate}</p></div><StatusBadge status={item.status} />
            </div>;
          })}
          {!followUps.length && <p className="section-subtitle">No open demonstration follow-ups.</p>}
        </div>
        <Link href="/interventions" className="button small" style={{ marginTop: 16, textDecoration: 'none' }} data-testid="link-view-interventions">Open interventions <ArrowRight size={13} /></Link>
      </Panel>
      <Panel title="Skills in focus" subtitle="Illustrative skill coverage across the sample cohort">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={skillData} layout="vertical" margin={{ top: 4, right: 10, left: 12, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis type="number" domain={[0, 100]} hide /><YAxis type="category" dataKey="skill" width={108} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 11 }} /><Bar dataKey="ready" fill="hsl(var(--chart-1))" radius={[0, 5, 5, 0]} barSize={13} />
          </BarChart></ResponsiveContainer>
        </div>
      </Panel>
    </div>
    <div className="panel panel-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: '#edf3ed' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="stat-icon"><BookOpenCheck size={17} /></span><div><div className="list-title">A useful starting point, not a decision system</div><div className="list-meta">All figures and chart values are demonstrations, not measured institutional analytics.</div></div></div>
      <Link className="button small" href="/academic-analytics" style={{ textDecoration: 'none' }} data-testid="link-academic-analytics">Explore analytics <ChartNoAxesCombined size={13} /></Link>
    </div>
  </section>;
}
