import { useMemo, useState } from 'react';
import { BookOpenCheck, ChartNoAxesCombined, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader, Panel, StatCard } from '@/components/workspace';
import { useStudentData, departments } from '@/data/student-data';

const attendanceSeries = [
  { label: 'Jan 06', attendance: 78, target: 82, progress: 64 },
  { label: 'Jan 13', attendance: 81, target: 82, progress: 66 },
  { label: 'Jan 20', attendance: 79, target: 82, progress: 69 },
  { label: 'Jan 27', attendance: 84, target: 82, progress: 72 },
  { label: 'Feb 03', attendance: 82, target: 82, progress: 73 },
  { label: 'Feb 10', attendance: 86, target: 82, progress: 77 },
  { label: 'Feb 17', attendance: 83, target: 82, progress: 79 },
  { label: 'Feb 24', attendance: 88, target: 82, progress: 82 },
];
const subjectSeries = [
  { subject: 'Data structures', score: 71, completion: 78 },
  { subject: 'Statistics', score: 76, completion: 84 },
  { subject: 'Technical writing', score: 83, completion: 91 },
  { subject: 'Research methods', score: 79, completion: 88 },
  { subject: 'Applied math', score: 68, completion: 74 },
];
const assignmentSeries = [
  { week: 'Week 1', onTime: 78, late: 12 }, { week: 'Week 2', onTime: 82, late: 9 },
  { week: 'Week 3', onTime: 75, late: 16 }, { week: 'Week 4', onTime: 86, late: 8 },
  { week: 'Week 5', onTime: 89, late: 6 }, { week: 'Week 6', onTime: 84, late: 10 },
];

export default function AcademicAnalytics() {
  const { students } = useStudentData();
  const [department, setDepartment] = useState('all');
  const [period, setPeriod] = useState('8');
  const studentSubset = useMemo(() => students.filter((student) => department === 'all' || student.department === department), [students, department]);
  const multiplier = department === 'all' ? 0 : Math.min(3, departments.indexOf(department) + 1) - 1;
  const attendance = attendanceSeries.slice(-Number(period)).map((point, index) => ({ ...point, attendance: Math.max(54, Math.min(96, point.attendance + (multiplier ? ((index + multiplier) % 3 - 1) * 3 : 0))) }));
  const averageAttendance = studentSubset.length ? Math.round(studentSubset.reduce((sum, student) => sum + student.attendance, 0) / studentSubset.length) : 0;
  const averageScore = studentSubset.length ? Math.round(studentSubset.reduce((sum, student) => sum + student.averageMarks, 0) / studentSubset.length) : 0;
  return <section className="workspace-page" data-testid="page-academic-analytics">
    <PageHeader eyebrow="ACADEMIC PROGRESS" title="Academic analytics" description="Explore sample attendance, learning progress, and assignment patterns. Use filters to focus these illustrative views." />
    <Panel title="View controls" subtitle="These filters change the presentation of demonstration chart data">
      <div className="filter-row">
        <div className="form-field"><label htmlFor="analytics-department">Department sample</label><select id="analytics-department" className="field-control" value={department} onChange={(event) => setDepartment(event.target.value)} data-testid="filter-analytics-department"><option value="all">All sample departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="form-field"><label htmlFor="analytics-period">Attendance window</label><select id="analytics-period" className="field-control" value={period} onChange={(event) => setPeriod(event.target.value)} data-testid="filter-analytics-period"><option value="4">Latest 4 weeks</option><option value="6">Latest 6 weeks</option><option value="8">Latest 8 weeks</option></select></div>
        <span className="demo-tag"><ChartNoAxesCombined size={12} /> Illustrative chart values</span>
      </div>
    </Panel>
    <div className="layout-three" style={{ marginTop: 15 }}>
      <StatCard label="Cohort attendance" value={`${averageAttendance}%`} detail={`Sample students shown: ${studentSubset.length}`} icon={TrendingUp} />
      <StatCard label="Average marks" value={`${averageScore}%`} detail="Calculated from current sample records" icon={BookOpenCheck} />
      <StatCard label="Assignment completion" value="83%" detail="Static illustrative completion estimate" icon={ClipboardCheck} />
    </div>
    <div className="layout-equal">
      <Panel title="Attendance trends" subtitle="Illustrative weekly attendance rate; not measured campus data">
        <div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-1))' }} />Sample attendance</span><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-2))' }} />Reference line</span></div>
        <div className="chart-box tall"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={attendance} margin={{ top: 8, right: 7, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="attendance" name="Attendance" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} barSize={20} /><Line dataKey="target" name="Illustrative reference" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
        </ComposedChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Subject performance" subtitle="Sample subject averages and assignment completion percentages">
        <div className="chart-box tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={subjectSeries} margin={{ top: 8, right: 4, left: -20, bottom: 2 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="subject" axisLine={false} tickLine={false} interval={0} angle={-16} textAnchor="end" height={49} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="score" name="Average marks" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} barSize={22}>{subjectSeries.map((entry, index) => <Cell key={entry.subject} fill={index === 4 ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-1))'} />)}</Bar>
        </BarChart></ResponsiveContainer></div>
      </Panel>
    </div>
    <div className="layout-two">
      <Panel title="Assignment completion" subtitle="Illustrative on-time and late submission trend">
        <div className="legend-row"><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-1))' }} />On time</span><span className="legend-item"><span className="legend-dot" style={{ background: 'hsl(var(--chart-4))' }} />Late</span></div>
        <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={assignmentSeries} margin={{ top: 7, right: 5, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Bar dataKey="onTime" name="On time" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} /><Bar dataKey="late" name="Late" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
        </BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Academic progress" subtitle="Illustrative course progress index over the selected window">
        <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={attendance} margin={{ top: 8, right: 7, left: -22, bottom: 0 }}>
          <defs><linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.01} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} /><Tooltip contentStyle={{ borderRadius: 9, borderColor: 'hsl(var(--border))', fontSize: 10 }} /><Area type="monotone" dataKey="progress" name="Progress index" stroke="hsl(var(--chart-3))" strokeWidth={2.5} fill="url(#progressFill)" />
        </AreaChart></ResponsiveContainer></div>
      </Panel>
    </div>
  </section>;
}
