import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Habits', path: '/habits' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Timetable', path: '/timetable' },
  { label: 'Focus Timer', path: '/focus-timer' },
  { label: 'Study Tracker', path: '/study-tracker' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Streaks', path: '/streaks' },
  { label: 'Auto Tasks', path: '/auto-task-generator' },
  { label: 'Settings', path: '/settings' },
]

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>FocusFlow</h1>
        <p>Productivity hub</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
