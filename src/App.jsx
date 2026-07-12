import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Calendar from './pages/Calendar'
import Timetable from './pages/Timetable'
import FocusTimer from './pages/FocusTimer'
import StudyTracker from './pages/StudyTracker'
import Roadmap from './pages/Roadmap'
import Streaks from './pages/Streaks'
import AutoTaskGenerator from './pages/AutoTaskGenerator'
import Settings from './pages/Settings'
import { AppProvider } from './context/AppContext'
import './App.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/focus-timer" element={<FocusTimer />} />
              <Route path="/study-tracker" element={<StudyTracker />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/streaks" element={<Streaks />} />
              <Route path="/auto-task-generator" element={<AutoTaskGenerator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div className="page page-empty">Page not found</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
