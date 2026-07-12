import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'
import { toDateKey, parseDateKey } from '../utils/date'

const Dashboard = () => {
  const { tasks, habits, dashboardStats, toggleTaskCompletion, toggleHabit } = useAppContext()
  const navigate = useNavigate()

  const today = useMemo(() => new Date(), [])
  const todayIso = toDateKey(today)

  const todaysTasks = useMemo(() => {
    const taskList = tasks.filter((task) => task.dueDate === todayIso)
    if (taskList.length) return taskList
    return tasks.filter((task) => !task.completed).slice(0, 5)
  }, [tasks, todayIso])

  const upcomingTasks = useMemo(
    () => tasks
      .filter((task) => task.dueDate && task.dueDate >= todayIso)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5),
    [tasks, todayIso]
  )

  const habitCompletionRate = useMemo(() => {
    if (!habits.length) return 0
    return Math.round((habits.filter((habit) => habit.active).length / habits.length) * 100)
  }, [habits])

  const recentActivities = useMemo(() => [
    { type: 'task', text: 'Completed Java Revision', time: '2 hours ago' },
    { type: 'habit', text: 'Meditation streak: 5 days', time: '1 hour ago' },
    { type: 'milestone', text: '25 tasks completed this month', time: 'Today' },
  ], [])

  const achievements = useMemo(() => [
    { icon: '🏆', title: 'Task Master', desc: 'Complete 50 tasks' },
    { icon: '🔥', title: 'On Fire', desc: 'Maintain 7-day streak' },
    { icon: '⭐', title: 'Consistent', desc: 'Use app for 30 days' },
  ], [])

  const heatmapCounts = useMemo(() => {
    // Deterministic placeholder activity counts derived from completed task count,
    // so the heatmap stays stable across renders instead of using Math.random().
    const seed = dashboardStats.completedTasks
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((_, i) => (seed + i * 3) % 12)
  }, [dashboardStats.completedTasks])

  return (
    <div className="page dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your productivity overview.</p>
        </div>
      </header>

      {/* QUICK ACTIONS */}
      <section className="quick-actions-section">
        <button type="button" onClick={() => navigate('/tasks')}>+ New Task</button>
        <button type="button" onClick={() => navigate('/habits')}>+ New Habit</button>
        <button type="button" onClick={() => navigate('/focus-timer')}>🎯 Focus Session</button>
        <button type="button" onClick={() => navigate('/calendar')}>📅 Calendar</button>
      </section>

      {/* STATISTICS CARDS */}
      <section className="stats-section">
        <article className="stat-card stat-primary">
          <div className="stat-content">
            <span className="stat-label">Total Tasks</span>
            <strong className="stat-value">{dashboardStats.totalTasks}</strong>
          </div>
          <div className="stat-icon">📋</div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <strong className="stat-value">{dashboardStats.completedTasks}</strong>
          </div>
          <div className="stat-icon">✅</div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <strong className="stat-value">{dashboardStats.pendingTasks}</strong>
          </div>
          <div className="stat-icon">⏳</div>
        </article>
        <article className="stat-card stat-highlight">
          <div className="stat-content">
            <span className="stat-label">Productivity</span>
            <strong className="stat-value">{dashboardStats.productivity}</strong>
          </div>
          <div className="stat-icon">📊</div>
        </article>
        <article className="stat-card stat-highlight">
          <div className="stat-content">
            <span className="stat-label">Current Streak</span>
            <strong className="stat-value">{dashboardStats.currentStreak}</strong>
          </div>
          <div className="stat-icon">🔥</div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <span className="stat-label">Focus Hours</span>
            <strong className="stat-value">{dashboardStats.focusHours}</strong>
          </div>
          <div className="stat-icon">⏱️</div>
        </article>
      </section>

      {/* TWO COLUMN SECTIONS */}
      <section className="dashboard-grid-2">
        {/* Today's Schedule | Focus Timer */}
        <div className="panel panel-full">
          <div className="panel-header">
            <h2>📅 Today's Schedule</h2>
          </div>
          <ul className="schedule-list">
            {todaysTasks.length > 0 ? todaysTasks.map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <label>
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} />
                  <span className="task-title">{task.title}</span>
                  <span className="task-priority">{task.priority}</span>
                </label>
              </li>
            )) : <li className="empty">No tasks scheduled for today</li>}
          </ul>
        </div>

        <div className="panel panel-full">
          <div className="panel-header">
            <h2>⏱️ Focus Timer</h2>
          </div>
          <div className="focus-timer-card">
            <div className="timer-display">00:00</div>
            <p>Start a focused work session</p>
            <button type="button" onClick={() => navigate('/focus-timer')}>Start Now</button>
          </div>
        </div>
      </section>

      {/* Today's Tasks | Habit Tracker */}
      <section className="dashboard-grid-2">
        <div className="panel panel-full">
          <div className="panel-header">
            <h2>✓ Today's Tasks ({todaysTasks.length})</h2>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${dashboardStats.totalTasks ? (dashboardStats.completedTasks / dashboardStats.totalTasks) * 100 : 0}%` }}></div>
          </div>
          <p className="progress-text">{dashboardStats.completedTasks} of {dashboardStats.totalTasks} completed</p>
        </div>

        <div className="panel panel-full">
          <div className="panel-header">
            <h2>🎯 Habit Tracker ({habits.length})</h2>
          </div>
          <ul className="habit-list-inline">
            {habits.length > 0 ? habits.slice(0, 6).map((habit) => (
              <li key={habit.id} className={habit.active ? 'active' : ''}>
                <label>
                  <input type="checkbox" checked={habit.active} onChange={() => toggleHabit(habit.id)} />
                  <span>{habit.title}</span>
                </label>
              </li>
            )) : <li className="empty">No habits yet</li>}
          </ul>
          <p className="habit-completion">Completion Rate: <strong>{habitCompletionRate}%</strong></p>
        </div>
      </section>

      {/* Study Tracker | Placement Readiness */}
      <section className="dashboard-grid-2">
        <div className="panel panel-full">
          <div className="panel-header">
            <h2>📚 Study Tracker</h2>
          </div>
          <div className="study-stats">
            <div className="stat-mini">
              <span>Daily Goal</span>
              <strong>8h</strong>
            </div>
            <div className="stat-mini">
              <span>This Week</span>
              <strong>{Math.max(8, dashboardStats.completedTasks)}h</strong>
            </div>
            <div className="stat-mini">
              <span>This Month</span>
              <strong>{Math.max(32, dashboardStats.completedTasks * 4)}h</strong>
            </div>
          </div>
        </div>

        <div className="panel panel-full">
          <div className="panel-header">
            <h2>💼 Placement Readiness</h2>
          </div>
          <div className="readiness-items">
            <div className="readiness-item">
              <span>Resume</span>
              <div className="progress-small" style={{ width: '85%' }}></div>
            </div>
            <div className="readiness-item">
              <span>Coding Skills</span>
              <div className="progress-small" style={{ width: '72%' }}></div>
            </div>
            <div className="readiness-item">
              <span>Interview Prep</span>
              <div className="progress-small" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals | Deadlines */}
      <section className="dashboard-grid-2">
        <div className="panel panel-full">
          <div className="panel-header">
            <h2>🎯 Goals</h2>
          </div>
          <ul className="goals-list">
            <li>Master Data Structures</li>
            <li>Build 3 projects</li>
            <li>Secure internship</li>
            <li>30-day streak</li>
          </ul>
        </div>

        <div className="panel panel-full">
          <div className="panel-header">
            <h2>📌 Upcoming Deadlines</h2>
          </div>
          <ul className="deadline-list">
            {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong>
                <span className="due-date">{parseDateKey(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </li>
            )) : <li className="empty">No upcoming deadlines</li>}
          </ul>
        </div>
      </section>

      {/* CHARTS & ANALYTICS */}
      <section className="analytics-section">
        <h2>📊 Charts & Analytics</h2>
        <div className="charts-placeholder">
          <p>Activity Charts (Weekly/Monthly trends)</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Charts coming soon</p>
        </div>
      </section>

      {/* ACTIVITY HEATMAP */}
      <section className="heatmap-section">
        <h2>🔥 Activity Heatmap</h2>
        <div className="heatmap-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="heatmap-day" style={{ opacity: 0.5 + (i * 0.1) }}>
              <div className="day-name">{day}</div>
              <div className="day-count">{heatmapCounts[i]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="recent-activity-section">
        <h2>📝 Recent Activity</h2>
        <ul className="activity-list">
          {recentActivities.map((activity, idx) => (
            <li key={idx}>
              <span className="activity-type">{activity.type}</span>
              <span className="activity-text">{activity.text}</span>
              <span className="activity-time">{activity.time}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="achievements-section">
        <h2>🏆 Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="achievement-card">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTIVITY SCORE */}
      <section className="productivity-score-section">
        <div className="score-card">
          <h2>Productivity Score</h2>
          <div className="score-display">
            <div className="score-circle">{dashboardStats.productivity}</div>
            <p>Based on task completion, habit consistency, and focus time</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard;
