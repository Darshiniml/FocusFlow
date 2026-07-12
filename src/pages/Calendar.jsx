import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar = () => {
  const { tasks, habitLogs } = useAppContext()
  const today = new Date()
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10))

  const monthLabel = useMemo(() => month.toLocaleString('default', { month: 'long', year: 'numeric' }), [month])

  const changeMonth = (offset) => {
    const next = new Date(month)
    next.setMonth(month.getMonth() + offset)
    setMonth(next)
  }

  // build month matrix for calendar grid (including previous/next months' trailing cells)
  const monthMatrix = useMemo(() => {
    const year = month.getFullYear()
    const m = month.getMonth()
    const firstDay = new Date(year, m, 1)
    const startWeekday = firstDay.getDay() // 0-6
    const daysInMonth = new Date(year, m + 1, 0).getDate()

    const cells = []
    // leading blanks from prev month
    const prevDays = startWeekday
    const prevMonthLastDay = new Date(year, m, 0).getDate()
    for (let i = prevDays - 1; i >= 0; i -= 1) {
      const day = prevMonthLastDay - i
      const date = new Date(year, m - 1, day)
      cells.push({ date, inMonth: false })
    }

    // current month days
    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = new Date(year, m, d)
      cells.push({ date, inMonth: true })
    }

    // trailing cells to complete weeks
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const date = new Date(last)
      date.setDate(last.getDate() + 1)
      cells.push({ date, inMonth: false })
    }

    // chunk into weeks
    const weeks = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    return weeks
  }, [month])

  // group tasks by ISO date
  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((t) => {
      if (!t.dueDate) return
      const key = t.dueDate.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return map
  }, [tasks])

  const habitLogsByDate = useMemo(() => {
    const map = {}
    habitLogs.forEach((h) => {
      if (!h.date) return
      const key = h.date.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(h)
    })
    return map
  }, [habitLogs])

  const details = tasksByDate[selectedDate] || []
  const [popover, setPopover] = useState({ open: false, dateKey: null, x: 0, y: 0 })

  const handleCellClick = (key, e) => {
    setSelectedDate(key)
    const rect = e.currentTarget.getBoundingClientRect()
    setPopover({ open: true, dateKey: key, x: rect.right + 8, y: rect.top })
  }

  const closePopover = () => setPopover({ open: false, dateKey: null, x: 0, y: 0 })

  return (
    <div className="page calendar-page">
      <header className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>See your monthly schedule and day details in one place.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={() => changeMonth(-1)}>◀</button>
          <button type="button" className="btn btn-secondary" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button>
          <button type="button" className="btn btn-secondary" onClick={() => changeMonth(1)}>▶</button>
        </div>
      </header>

      <section className="panel calendar-panel">
        <h2 className="center">{monthLabel}</h2>
        <div className="calendar-grid">
          {weekDays.map((wd) => (
            <div key={wd} className="calendar-weekday muted center">{wd}</div>
          ))}

          {monthMatrix.map((week) => (
            week.map((cell) => {
              const key = cell.date.toISOString().slice(0, 10)
              const isToday = key === today.toISOString().slice(0, 10)
              const isSelected = key === selectedDate
              const dayTasks = tasksByDate[key] || []

              return (
                <button
                  key={key}
                  type="button"
                  className={"calendar-cell " + (cell.inMonth ? 'in-month' : 'out-month') + (isToday ? ' today' : '') + (isSelected ? ' selected' : '')}
                  onClick={(e) => handleCellClick(key, e)}
                >
                  <div className="cell-top">
                    <span className="cell-day">{cell.date.getDate()}</span>
                  </div>
                  <div className="cell-body">
                    <div className="cell-dots">
                      {dayTasks.slice(0, 3).map((t) => {
                        const taskDateKey = key
                        const dateObj = new Date(taskDateKey)
                        const isPast = dateObj < new Date(today.toISOString().slice(0, 10))
                        const color = t.completed ? 'green' : (isPast ? 'red' : 'yellow')
                        return <span key={t.id} className={"status-dot " + color} title={t.title}></span>
                      })}
                      {dayTasks.length > 3 && <span className="cell-more">+{dayTasks.length - 3}</span>}
                    </div>

                    {habitLogsByDate[key] && <div className="cell-habits muted">{habitLogsByDate[key].length} habit(s)</div>}
                  </div>
                </button>
              )
            })
          ))}
        </div>
      </section>

      <div className="calendar-legend panel">
        <strong>Legend:</strong>
        <div className="legend-items">
          <span className="legend-item"><span className="status-dot green" /> Completed</span>
          <span className="legend-item"><span className="status-dot yellow" /> Pending</span>
          <span className="legend-item"><span className="status-dot red" /> Overdue</span>
          <span className="legend-item muted">• <em>habits</em> show counts in cells</span>
        </div>
      </div>

      {popover.open && (
        <div className="popover" style={{ left: popover.x, top: popover.y }} role="dialog" aria-modal="false">
          <button className="popover-close" onClick={closePopover}>×</button>
          <h4>{new Date(popover.dateKey).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</h4>
          <div className="popover-section">
            <strong>Tasks</strong>
            <ul>
              {(tasksByDate[popover.dateKey] || []).map((t) => (
                <li key={t.id}>{t.title} <small className="muted">({t.priority})</small></li>
              ))}
              {(tasksByDate[popover.dateKey] || []).length === 0 && <li className="muted">No tasks</li>}
            </ul>
          </div>
          <div className="popover-section">
            <strong>Habits</strong>
            <ul>
              {(habitLogsByDate[popover.dateKey] || []).map((h) => (
                <li key={h.id}>Habit logged (id: {h.habitId})</li>
              ))}
              {(habitLogsByDate[popover.dateKey] || []).length === 0 && <li className="muted">No habit logs</li>}
            </ul>
          </div>
        </div>
      )}

      <section className="panel day-details-panel">
        <h2>Selected Day Details</h2>
        <p>Date: {new Date(selectedDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <div>
          <h3>Tasks:</h3>
          <ul>
            {details.map((task) => (
              <li key={task.id}>{task.title} <small className="muted">({task.priority})</small></li>
            ))}
            {details.length === 0 && <li>No tasks scheduled</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Calendar;
