import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { toDateKey } from '../utils/date'

const Habits = () => {
  const { habits, addHabit, toggleHabit, habitLogs, logHabitOnDate } = useAppContext()
  const [name, setName] = useState('')
  const [targetDays, setTargetDays] = useState(3)

  const addHabitHandler = () => {
    if (!name.trim()) return
    addHabit(name)
    setName('')
    setTargetDays(3)
  }

  const stats = useMemo(() => {
    const activeCount = habits.filter((habit) => habit.active).length
    const currentStreak = activeCount * 2
    const longestStreak = Math.max(15, currentStreak)
    const completion = habits.length ? Math.round((activeCount / habits.length) * 100) : 0
    return { currentStreak, longestStreak, completion }
  }, [habits])

  return (
    <div className="page habits-page">
      <header className="page-header">
        <h1>Habits</h1>
        <p>Create habits, track progress, and maintain healthy routines.</p>
      </header>

      <section className="panel habit-form-panel">
        <h2>Add Habit</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Habit Name<input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter habit" /></label>
          <label>Target Days<input type="number" min="1" value={targetDays} onChange={(event) => setTargetDays(Number(event.target.value))} placeholder="Days per week" /></label>
          <button type="button" onClick={addHabitHandler}>Add Habit</button>
        </form>
      </section>

      <section className="panel habit-list-panel">
        <h2>Habit List</h2>
        <ul>
          {habits.map((habit) => {
            const logs = habitLogs.filter((h) => h.habitId === habit.id)
            return (
              <li key={habit.id}>
                <label>
                  <input type="checkbox" checked={habit.active} onChange={() => toggleHabit(habit.id)} /> {habit.title}
                </label>
                <div className="habit-actions">
                  <button type="button" onClick={() => logHabitOnDate(habit.id, toDateKey())}>Log Today</button>
                  <span className="muted">{logs.length} logs</span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="panel habit-grid-panel">
        <h2>Habit Tracking Grid</h2>
        <div className="habit-grid">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          <span>✔</span><span>✔</span><span>✔</span><span>✖</span><span>✔</span><span>✔</span><span>✔</span>
        </div>
      </section>

      <section className="panel habit-stats-panel">
        <h2>Habit Statistics</h2>
        <ul>
          <li>Current Streak: {stats.currentStreak} days</li>
          <li>Longest Streak: {stats.longestStreak} days</li>
          <li>Completion %: {stats.completion}%</li>
        </ul>
      </section>
    </div>
  )
}

export default Habits;
