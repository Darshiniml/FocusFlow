import { useMemo, useState } from 'react'
import { toDateKey } from '../utils/date'

const baseSubjects = ['Java', 'DSA', 'SQL', 'DBMS', 'OS', 'CN', 'Spring Boot', 'Aptitude']

const StudyTracker = () => {
  const [subject, setSubject] = useState('Java')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('1')
  const [date, setDate] = useState(toDateKey())
  const [sessions, setSessions] = useState([
    { id: 1, subject: 'Java', topic: 'Collections', duration: 2, date: '2026-08-15' },
    { id: 2, subject: 'DSA', topic: 'Arrays', duration: 1.5, date: '2026-08-14' },
    { id: 3, subject: 'SQL', topic: 'Joins', duration: 1, date: '2026-08-13' },
  ])

  const totals = useMemo(() => {
    const result = baseSubjects.reduce((acc, subjectName) => ({ ...acc, [subjectName]: 0 }), {})
    sessions.forEach((session) => {
      result[session.subject] = (result[session.subject] || 0) + session.duration
    })
    return result
  }, [sessions])

  const totalHours = useMemo(() => sessions.reduce((sum, session) => sum + session.duration, 0), [sessions])
  const mostStudied = useMemo(() => Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Java', [totals])
  const leastStudied = useMemo(() => Object.entries(totals).sort((a, b) => a[1] - b[1])[0]?.[0] || 'CN', [totals])

  const addSession = () => {
    if (!topic.trim()) return
    setSessions((prev) => [
      ...prev,
      { id: Date.now(), subject, topic: topic.trim(), duration: Number(duration), date },
    ])
    setTopic('')
    setDuration('1')
  }

  return (
    <div className="page study-page">
      <header className="page-header">
        <h1>Study Tracker</h1>
        <p>Track study sessions, subjects, and weekly learning goals.</p>
      </header>

      <section className="panel subject-cards-panel">
        <h2>Subject Cards</h2>
        <div className="subject-cards">
          {baseSubjects.map((subjectName) => (
            <div key={subjectName}>{subjectName}</div>
          ))}
        </div>
      </section>

      <section className="panel session-tracker-panel">
        <h2>Track Study Session</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}>{baseSubjects.map((subjectName) => <option key={subjectName}>{subjectName}</option>)}</select></label>
          <label>Topic<input value={topic} onChange={(event) => setTopic(event.target.value)} type="text" /></label>
          <label>Duration<input value={duration} onChange={(event) => setDuration(event.target.value)} type="number" min="0.25" step="0.25" placeholder="1.5" /></label>
          <label>Date<input value={date} onChange={(event) => setDate(event.target.value)} type="date" /></label>
          <button type="button" onClick={addSession}>Log Session</button>
        </form>
      </section>

      <section className="panel progress-panel">
        <h2>Progress</h2>
        <ul>
          <li>Java {totals.Java || 0}/20 Hours</li>
          <li>DSA {totals.DSA || 0}/20 Hours</li>
          <li>SQL {totals.SQL || 0}/10 Hours</li>
        </ul>
      </section>

      <section className="panel recent-sessions-panel">
        <h2>Recent Sessions</h2>
        <ul>
          {sessions.slice().reverse().map((session) => (
            <li key={session.id}>{session.subject} {session.topic} - {session.duration} Hours</li>
          ))}
        </ul>
      </section>

      <section className="panel weekly-report-panel">
        <h2>Weekly Report</h2>
        <ul>
          <li>Total Study Hours: {totalHours.toFixed(1)}h</li>
          <li>Most Studied Subject: {mostStudied}</li>
          <li>Least Studied Subject: {leastStudied}</li>
        </ul>
      </section>
    </div>
  )
}

export default StudyTracker;
