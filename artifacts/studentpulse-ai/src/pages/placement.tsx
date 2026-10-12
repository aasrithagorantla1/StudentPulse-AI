import { useState } from 'react';
import { BriefcaseBusiness, Check, CircleHelp, MapPin, Sparkles } from 'lucide-react';
import { PageHeader, Panel, SampleNotice } from '@/components/workspace';
import { useStudentData } from '@/data/student-data';

const jobs = [
  { id: 'role-01', title: 'Junior Data Analyst', organization: 'Northline Research Co.', location: 'Hybrid · Riverton', skills: ['SQL', 'Excel', 'Data visualization', 'Communication'], semester: 5, marks: 70, type: 'Analyst pathway' },
  { id: 'role-02', title: 'Software Engineering Intern', organization: 'Fieldnote Systems', location: 'On-site · Riverton', skills: ['Python', 'Git', 'Problem solving', 'Teamwork'], semester: 5, marks: 72, type: 'Technology pathway' },
  { id: 'role-03', title: 'Operations Associate', organization: 'Harbor & Pine', location: 'Hybrid · Lakeview', skills: ['Communication', 'Excel', 'Research', 'Teamwork'], semester: 4, marks: 68, type: 'Business pathway' },
];

export default function Placement() {
  const { students } = useStudentData();
  const [studentId, setStudentId] = useState(students[0]?.id ?? '');
  const [activeJob, setActiveJob] = useState(jobs[0].id);
  const student = students.find((entry) => entry.id === studentId) ?? students[0];
  const job = jobs.find((entry) => entry.id === activeJob) ?? jobs[0];
  const matched = job.skills.filter((skill) => student?.skills.includes(skill));
  const missing = job.skills.filter((skill) => !student?.skills.includes(skill));
  const criteria = student ? [
    { label: `Semester ${job.semester}+`, meets: student.semester >= job.semester },
    { label: `Average marks ${job.marks}%+`, meets: student.averageMarks >= job.marks },
  ] : [];
  const criteriaMet = criteria.every((item) => item.meets);
  return <section className="workspace-page" data-testid="page-placement">
    <PageHeader eyebrow="PLACEMENT PATHWAYS" title="Explore pathways" description="Compare sample opportunity criteria with a selected demonstration profile. This is a transparent preview, not a placement recommendation." />
    <Panel title="Choose a sample student" subtitle="New student entries in this session are available here">
      <div className="filter-row">
        <div className="form-field" style={{ minWidth: 240 }}><label htmlFor="placement-student">Student profile</label><select id="placement-student" className="field-control" value={studentId} onChange={(event) => setStudentId(event.target.value)} data-testid="select-placement-student">{students.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.id}</option>)}</select></div>
        {student && <div className="detail-grid" style={{ minWidth: 260, flex: 1 }}><div className="detail-item"><div className="detail-label">Sample department</div><div className="detail-value">{student.department}</div></div><div className="detail-item"><div className="detail-label">Semester / average</div><div className="detail-value">{student.semester} · {student.averageMarks}%</div></div></div>}
      </div>
    </Panel>
    <div className="layout-two placement-layout" style={{ marginTop: 15 }}>
      <Panel title="Sample opportunities" subtitle="Fictional employers, roles, and requirements for interface demonstration">
        <div className="list-stack">{jobs.map((item) => <button type="button" key={item.id} className={`job-card table-row${activeJob === item.id ? ' selected' : ''}`} onClick={() => setActiveJob(item.id)} data-testid={`button-job-${item.id}`} aria-pressed={activeJob === item.id} style={{ width: '100%', marginBottom: 9, border: '1px solid hsl(var(--border))', borderRadius: 10, textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><span className="demo-tag">{item.type}</span><h3 className="section-title" style={{ marginTop: 10 }}>{item.title}</h3><p className="list-meta">{item.organization}</p></div><BriefcaseBusiness size={17} color="hsl(var(--primary))" /></div>
          <div className="list-meta" style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}><MapPin size={12} />{item.location}</div>
        </button>)}</div>
      </Panel>
      <Panel title={job.title} subtitle={`${job.organization} · fictional sample listing`}>
        <div style={{ marginBottom: 16 }}><div className="eyebrow-chip"><Sparkles size={13} />Skills readiness (sample comparison)</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 8 }}><strong style={{ fontFamily: 'var(--app-font-serif)', fontSize: 31 }}>{job.skills.length ? Math.round(matched.length / job.skills.length * 100) : 0}%</strong><span className="section-subtitle">{matched.length} of {job.skills.length} listed skills found</span></div></div>
        <div className="detail-label" style={{ marginBottom: 8 }}>Matching listed skills</div>
        <div className="skill-list">{matched.length ? matched.map((skill) => <span key={skill} className="skill-chip"><Check size={12} />{skill}</span>) : <span className="section-subtitle">No listed skills matched in this sample profile.</span>}</div>
        <div className="detail-label" style={{ margin: '17px 0 8px' }}>Skills not listed in sample profile</div>
        <div className="skill-list">{missing.map((skill) => <span key={skill} className="skill-chip missing"><CircleHelp size={12} />{skill}</span>)}</div>
        <div className="criteria-box" data-testid="placement-criteria">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><div className="list-title">Criteria eligibility</div><span className={`badge ${criteriaMet ? '' : 'warning'}`}>{criteriaMet ? 'Criteria met' : 'Criteria not met'}</span></div>
          <p className="section-subtitle">Separate from skills readiness; criteria are sample listing rules only.</p>
          {criteria.map((item) => <div className="criteria-row" key={item.label}><span className={`badge ${item.meets ? '' : 'warning'}`}>{item.meets ? 'Met' : 'Not met'}</span>{item.label}</div>)}
        </div>
        <SampleNotice>Client-side comparison against fictional criteria only. No institutional or hiring decision is made or implied.</SampleNotice>
      </Panel>
    </div>
  </section>;
}
