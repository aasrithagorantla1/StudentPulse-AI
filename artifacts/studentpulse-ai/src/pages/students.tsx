import { useMemo, useState } from 'react';
import { Search, UserRound, UsersRound, X } from 'lucide-react';
import { AddStudentDialog, PageHeader, Panel, StatusBadge } from '@/components/workspace';
import { useStudentData, departments, type Student } from '@/data/student-data';

function StudentDetail({ student }: { student: Student | null }) {
  if (!student) return <aside className="panel detail-panel"><div className="empty-state"><UserRound size={23} /><h3>Select a student</h3><p>Choose a row to see sample academic and pathway details.</p></div></aside>;
  return <aside className="panel detail-panel" aria-label={`Demonstration details for ${student.name}`} data-testid={`student-detail-${student.id}`}>
    <div className="panel-head"><div><span className="demo-tag">Sample profile</span></div></div>
    <div className="detail-top"><span className="initials">{student.name.split(' ').map((part) => part[0]).join('')}</span><div><h2 className="detail-name">{student.name}</h2><p className="detail-id">{student.id}</p></div></div>
    <StatusBadge status={student.reviewStatus} />
    <div className="detail-grid" style={{ marginTop: 17 }}>
      <div className="detail-item"><div className="detail-label">Department</div><div className="detail-value">{student.department}</div></div>
      <div className="detail-item"><div className="detail-label">Semester</div><div className="detail-value">{student.semester}</div></div>
      <div className="detail-item"><div className="detail-label">Attendance</div><div className="detail-value">{student.attendance}%</div></div>
      <div className="detail-item"><div className="detail-label">Average marks</div><div className="detail-value">{student.averageMarks}%</div></div>
    </div>
    <div className="detail-item" style={{ marginTop: 14 }}><div className="detail-label">Sample skills on file</div><div className="skill-list" style={{ marginTop: 9 }}>{student.skills.length ? student.skills.map((skill) => <span key={skill} className="skill-chip">{skill}</span>) : <span className="section-subtitle">No demonstration skills added.</span>}</div></div>
  </aside>;
}

export default function Students() {
  const { students } = useStudentData();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(students[0]?.id ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const rows = useMemo(() => students.filter((student) => {
    const matchesQuery = `${student.id} ${student.name} ${student.department}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (department === 'all' || student.department === department) && (status === 'all' || student.reviewStatus === status);
  }), [students, query, department, status]);
  const selected = students.find((student) => student.id === selectedId) ?? null;
  const clearFilters = () => { setQuery(''); setDepartment('all'); setStatus('all'); };
  const chooseRow = (student: Student) => setSelectedId(student.id);
  return <section className="workspace-page" data-testid="page-students">
    <PageHeader eyebrow="STUDENT SUPPORT" title="Student directory" description="Find a student, review a demonstration profile, and keep a shared view of support needs." action={<button className="button primary" onClick={() => setDialogOpen(true)} data-testid="button-add-student"><UsersRound size={15} />Add student</button>} />
    <div className="student-layout">
      <Panel title="Students" subtitle={`${rows.length} of ${students.length} demonstration records`}>
        <div className="toolbar">
          <label className="search-control"><Search size={15} /><input className="control" type="search" aria-label="Search students" placeholder="Search name, ID, or department" value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-search-students" /></label>
          <select className="control" aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} data-testid="filter-student-department"><option value="all">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="control" aria-label="Filter by review status" value={status} onChange={(event) => setStatus(event.target.value)} data-testid="filter-student-status"><option value="all">All review statuses</option><option>On track</option><option>Needs review</option><option>Monitoring</option></select>
          {(query || department !== 'all' || status !== 'all') && <button className="button small" onClick={clearFilters} data-testid="button-clear-student-filters"><X size={13} />Clear</button>}
        </div>
        {rows.length ? <div className="table-wrap">
          <table className="data-table" data-testid="table-students"><thead><tr><th>Student</th><th>Department</th><th>Semester</th><th>Attendance</th><th>Average marks</th><th>Review status</th></tr></thead>
            <tbody>{rows.map((student) => <tr key={student.id} className={`table-row${selectedId === student.id ? ' selected' : ''}`} tabIndex={0} aria-selected={selectedId === student.id} onClick={() => chooseRow(student)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); chooseRow(student); } }} data-testid={`row-student-${student.id}`}>
              <td data-label="Student"><div className="table-person"><span className="initials">{student.name.split(' ').map((part) => part[0]).join('')}</span><span><span className="person-name">{student.name}</span><span className="person-id">{student.id}</span></span></div></td>
              <td data-label="Department">{student.department}</td><td data-label="Semester">{student.semester}</td><td data-label="Attendance">{student.attendance}%</td><td data-label="Average marks">{student.averageMarks}%</td><td data-label="Review status"><StatusBadge status={student.reviewStatus} /></td>
            </tr>)}</tbody>
          </table>
        </div> : <div className="empty-state"><UsersRound size={24} /><h3>No matching students</h3><p>Try a different search or remove one of the filters.</p><button className="button small" style={{ marginTop: 12 }} onClick={clearFilters} data-testid="button-empty-clear-filters">Clear filters</button></div>}
        <p className="section-subtitle" style={{ marginTop: 13 }}>All people and academic values shown are fabricated demonstration records.</p>
      </Panel>
      <StudentDetail student={selected} />
    </div>
    <AddStudentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
  </section>;
}
