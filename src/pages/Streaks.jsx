import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { toDateKey as formatDate } from '../utils/date'

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const buildHeatmapDays = () => {
  const today = new Date()
  return Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(today)
    day.setDate(today.getDate() - (6 - index))
    return {
      date: day,
      key: formatDate(day),
      label: dayLabels[day.getDay()],
    }
  })
}

const Streaks = () => {
  const {
    tasks,
    habits,
    habitLogs,
    logHabitOnDate,
    completeTasksOnDate,
    uncompleteTasksOnDate,
    clearHabitLogsOnDate,
  } = useAppContext()
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, text: 'Completed morning focus session', status: 'Done', isCustom: true },
    { id: 2, text: 'Reviewed DSA notes', status: 'Done', isCustom: true },
    { id: 3, text: 'Updated roadmap goals', status: 'Pending', isCustom: true },
  ])
  const [newActivity, setNewActivity] = useState('')

  const todayKey = formatDate(new Date())

  const completionsByDate = useMemo(() => {
    return tasks.reduce((map, task) => {
      const completionDate = task.completedAt || (task.completed && task.dueDate) || null
      if (completionDate) {
        map[completionDate] = (map[completionDate] || 0) + 1
      }
      return map
    }, {})
  }, [tasks])

  const habitCountsByDate = useMemo(() => {
    return habitLogs.reduce((map, log) => {
      map[log.date] = (map[log.date] || 0) + 1
      return map
    }, {})
  }, [habitLogs])

  const heatmap = useMemo(() => {
    return buildHeatmapDays().map((day) => {
      const taskCount = completionsByDate[day.key] || 0
      const habitCount = habitCountsByDate[day.key] || 0
      const totalCount = taskCount + habitCount
      const status = totalCount > 0 ? 1 : day.key === todayKey ? 0 : -1
      const note = totalCount > 0
        ? `${totalCount} completion${totalCount > 1 ? 's' : ''}`
        : day.key === todayKey
          ? 'No progress yet'
          : 'Missed'

      return {
        ...day,
        status,
        note,
      }
    })
  }, [completionsByDate, habitCountsByDate, todayKey])

  const currentStreak = useMemo(() => {
    let streak = 0
    for (let i = heatmap.length - 1; i >= 0; i -= 1) {
      if (heatmap[i].status === 1) streak += 1
      else break
    }
    return streak
  }, [heatmap])

  const bestStreak = useMemo(() => {
    let best = 0
    let running = 0
    heatmap.forEach((day) => {
      if (day.status === 1) {
        running += 1
        best = Math.max(best, running)
      } else {
        running = 0
      }
    })
    return best
  }, [heatmap])

  const progress = useMemo(() => {
    const total = heatmap.length
    const completed = heatmap.filter((item) => item.status === 1).length
    return Math.round((completed / total) * 100)
  }, [heatmap])

  const actualRecentActivity = useMemo(() => {
    const events = []

    tasks.forEach((task) => {
      const date = task.completedAt || (task.completed && task.dueDate)
      if (date) {
        events.push({
          id: `task-${task.id}-${date}`,
          text: `Completed task “${task.title}”`,
          status: 'Done',
          date,
          isCustom: false,
        })
      }
    })

    habitLogs.forEach((log) => {
      const habit = habits.find((item) => item.id === log.habitId)
      events.push({
        id: `habit-${log.id}`,
        text: `Logged habit “${habit?.title || 'Habit'}”`,
        status: 'Done',
        date: log.date,
        isCustom: false,
      })
    })

    return events
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  }, [tasks, habits, habitLogs])

  const activityItems = useMemo(() => {
    const allItems = [...recentActivity, ...actualRecentActivity]
    const uniqueIds = new Set()
    return allItems.filter((item) => {
      if (uniqueIds.has(item.id)) return false
      uniqueIds.add(item.id)
      return true
    })
  }, [recentActivity, actualRecentActivity])

  const markTodayProgress = () => {
    completeTasksOnDate(todayKey)
    habits.filter((habit) => habit.active).forEach((habit) => logHabitOnDate(habit.id, todayKey))
    setRecentActivity((prev) => [
      { id: Date.now(), text: 'Marked today as completed', status: 'Done', isCustom: true },
      ...prev,
    ])
  }

  const clearTodayProgress = () => {
    uncompleteTasksOnDate(todayKey)
    clearHabitLogsOnDate(todayKey)
    setRecentActivity((prev) => [
      { id: Date.now(), text: 'Reset today progress', status: 'Pending', isCustom: true },
      ...prev,
    ])
  }

  const toggleDayProgress = (dayKey) => {
    if (dayKey !== todayKey) return
    if (completionsByDate[dayKey] || habitCountsByDate[dayKey]) {
      clearTodayProgress()
    } else {
      markTodayProgress()
    }
  }

  const addActivity = () => {
    if (!newActivity.trim()) return
    setRecentActivity((prev) => [
      { id: Date.now(), text: newActivity.trim(), status: 'Pending', isCustom: true },
      ...prev,
    ])
    setNewActivity('')
  }

  const removeActivity = (id) => {
    setRecentActivity((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleActivityStatus = (id) => {
    setRecentActivity((prev) => prev.map((item) => {
      if (item.id !== id) return item
      return { ...item, status: item.status === 'Done' ? 'Pending' : 'Done' }
    }))
  }

  return (
    <div className="page streaks-page">
      <header className="page-header">
        <div>
          <h1>Streaks</h1>
          <p>Track your consistency, celebrate wins, and keep progress visible.</p>
        </div>
        <div className="streak-summary-card">
          <div>
            <span className="stat-label">Current Streak</span>
            <strong>{currentStreak} days</strong>
          </div>
          <div>
            <span className="stat-label">Best Streak</span>
            <strong>{bestStreak} days</strong>
          </div>
          <div>
            <span className="stat-label">Completion</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </header>

      <section className="panel heatmap-panel">
        <div className="panel-header">
          <h2>Activity Heatmap</h2>
          <span className="muted">Click today to toggle real progress from your tasks and habits.</span>
        </div>
        <div className="heatmap-grid">
          {heatmap.map((day) => {
            const isToday = day.key === todayKey
            return (
              <button
                key={day.key}
                type="button"
                className={`heatmap-cell ${isToday ? 'interactive' : 'read-only'}`}
                onClick={() => toggleDayProgress(day.key)}
                disabled={!isToday}
              >
                <span className="heatmap-day">{day.label}{isToday ? ' · Today' : ''}</span>
                <div className={`heat-indicator ${day.status === 1 ? 'good' : day.status === 0 ? 'average' : 'missed'}`}>
                  {day.status === 1 ? '✔' : day.status === 0 ? '•' : '✖'}
                </div>
                <small className="heat-note">{day.note}</small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="panel activity-panel">
        <div className="panel-header">
          <h2>Recent Activity</h2>
          <span className="muted">Live updates from habits and completed tasks are shown first.</span>
        </div>
        <form className="activity-form" onSubmit={(event) => { event.preventDefault(); addActivity() }}>
          <input
            type="text"
            value={newActivity}
            onChange={(event) => setNewActivity(event.target.value)}
            placeholder="Add a recent activity"
          />
          <button type="submit" className="btn btn-primary">Add Activity</button>
        </form>
        <ul className="activity-list">
          {activityItems.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.text}</strong>
                <div className="activity-status">{item.status}</div>
              </div>
              <div className="activity-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={!item.isCustom}
                  onClick={() => item.isCustom && toggleActivityStatus(item.id)}
                >
                  {item.status === 'Done' ? 'Undo' : 'Done'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={!item.isCustom}
                  onClick={() => item.isCustom && removeActivity(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel achievements-panel">
        <div className="panel-header">
          <h2>Achievements</h2>
          <button type="button" className="btn btn-secondary">View Milestones</button>
        </div>
        <div className="achievement-grid">
          {['First Task Completed', '7 Day Streak', '30 Day Streak', '100 Tasks Completed'].map((item) => (
            <div key={item} className="achievement-card">{item}</div>
          ))}
        </div>
      </section>

      <section className="panel streaks-actions">
        <button type="button" className="btn btn-primary" onClick={markTodayProgress}>Complete Today</button>
        <button type="button" className="btn btn-secondary" onClick={clearTodayProgress}>Reset Today</button>
      </section>
    </div>
  )
}

export default Streaks;
