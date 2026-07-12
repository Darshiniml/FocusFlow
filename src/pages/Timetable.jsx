import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const Timetable = () => {
  const { timetableSlots, addTimetableSlot, removeTimetableSlot, autoGenerateTimetable } = useAppContext()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({ day: 'Monday', time: '', label: '' })
  const [status, setStatus] = useState('')

  const columns = useMemo(() => {
    const byDay = days.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
    timetableSlots.forEach((slot) => {
      if (byDay[slot.day]) byDay[slot.day].push(slot)
    })
    const maxRows = Math.max(1, ...days.map((day) => byDay[day].length))
    return { byDay, maxRows }
  }, [timetableSlots])

  const handleAddSlot = () => {
    if (!form.time.trim() || !form.label.trim()) return
    addTimetableSlot({ day: form.day, time: form.time.trim(), label: form.label.trim() })
    setForm({ day: form.day, time: '', label: '' })
    setShowAddForm(false)
  }

  const handleAutoGenerate = () => {
    const added = autoGenerateTimetable()
    setStatus(added > 0 ? `Added ${added} slot${added === 1 ? '' : 's'} from your pending tasks` : 'No free days or pending tasks to schedule')
  }

  return (
    <div className="page timetable-page">
      <header className="page-header">
        <div>
          <h1>Weekly Timetable</h1>
          <p>Organize your week with scheduled time slots and smart task generation.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm((prev) => !prev)}>Add Slot</button>
          <button type="button" className="btn btn-secondary" onClick={handleAutoGenerate}>Auto Generate</button>
        </div>
      </header>

      {showAddForm && (
        <section className="panel add-slot-panel">
          <h2>Add Time Slot</h2>
          <form onSubmit={(event) => event.preventDefault()}>
            <label>Day
              <select value={form.day} onChange={(event) => setForm((prev) => ({ ...prev, day: event.target.value }))}>
                {days.map((day) => <option key={day}>{day}</option>)}
              </select>
            </label>
            <label>Time<input value={form.time} onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))} type="text" placeholder="e.g. 6 AM" /></label>
            <label>Activity<input value={form.label} onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))} type="text" placeholder="e.g. DSA Practice" /></label>
            <button type="button" onClick={handleAddSlot}>Save Slot</button>
          </form>
        </section>
      )}

      {status && <p className="status-message">{status}</p>}

      <section className="panel timetable-panel">
        <div className="panel-header">
          <h2>Weekly Schedule</h2>
          <span className="muted">Click a filled slot to remove it.</span>
        </div>
        <div className="timetable-grid">
          {days.map((day) => (
            <div key={day} className="timetable-header">{day.slice(0, 3)}</div>
          ))}

          {Array.from({ length: columns.maxRows }).map((_, rowIndex) => (
            days.map((day) => {
              const slot = columns.byDay[day][rowIndex]
              return (
                <div
                  key={`${day}-${rowIndex}`}
                  className={slot ? 'timetable-cell filled' : 'timetable-cell empty'}
                  onClick={slot ? () => removeTimetableSlot(slot.id) : undefined}
                  role={slot ? 'button' : undefined}
                  tabIndex={slot ? 0 : undefined}
                  title={slot ? 'Click to remove' : undefined}
                >
                  {slot ? `${slot.time} - ${slot.label}` : <span className="muted">Free</span>}
                </div>
              )
            })
          ))}
        </div>
      </section>

      <section className="panel timetable-features-panel">
        <div className="panel-header">
          <h2>Key Features</h2>
          <span className="muted">A lightweight view of timetable options.</span>
        </div>
        <ul className="feature-list">
          <li>Preview your week at a glance</li>
          <li>Quickly add or shift time blocks</li>
          <li>Connect slots to task generation</li>
          <li>Track focus sessions and study windows</li>
        </ul>
      </section>
    </div>
  )
}

export default Timetable;
