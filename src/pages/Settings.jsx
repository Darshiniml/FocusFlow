import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { downloadJson } from '../utils/download'
import { toDateKey } from '../utils/date'

const Settings = () => {
  const { theme, setTheme, profile, setProfile, preferences, setPreferences, getSnapshot, restoreSnapshot } = useAppContext()
  const [status, setStatus] = useState('')

  const handleChange = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }))
  const togglePref = (key) => setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleExport = () => {
    downloadJson(getSnapshot(), `focusflow-export-${toDateKey()}.json`)
    setStatus('Data exported')
  }

  const handleBackup = () => {
    try {
      window.localStorage.setItem('focusflow-backup', JSON.stringify(getSnapshot()))
      setStatus(`Backed up at ${new Date().toLocaleTimeString()}`)
    } catch {
      setStatus('Backup failed - storage unavailable')
    }
  }

  const handleRestore = () => {
    const raw = window.localStorage.getItem('focusflow-backup')
    if (!raw) {
      setStatus('No backup found - use Backup Data first')
      return
    }
    if (!window.confirm('Restore from your last backup? This will overwrite current data.')) return
    try {
      restoreSnapshot(JSON.parse(raw))
      setStatus('Data restored from backup')
    } catch {
      setStatus('Restore failed - backup data was corrupted')
    }
  }

  return (
    <div className="page settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile, preferences, and backup options.</p>
      </header>

      <section className="panel profile-panel">
        <h2>Profile</h2>
        <label>Name<input value={profile.name} onChange={(event) => handleChange('name', event.target.value)} type="text" placeholder="Your name" /></label>
        <label>Email<input value={profile.email} onChange={(event) => handleChange('email', event.target.value)} type="email" placeholder="you@example.com" /></label>
        <label>Profile Picture<input value={profile.avatar} onChange={(event) => handleChange('avatar', event.target.value)} type="text" placeholder="Image URL" /></label>
      </section>

      <section className="panel preferences-panel">
        <h2>Preferences</h2>
        <label><input type="radio" checked={theme === 'dark'} onChange={() => setTheme('dark')} name="theme" /> Dark Mode</label>
        <label><input type="radio" checked={theme === 'light'} onChange={() => setTheme('light')} name="theme" /> Light Mode</label>
        <label><input type="checkbox" checked={preferences.notifications} onChange={() => togglePref('notifications')} /> Notifications</label>
        <label><input type="checkbox" checked={preferences.taskReminders} onChange={() => togglePref('taskReminders')} /> Task Reminders</label>
        <label><input type="checkbox" checked={preferences.habitReminders} onChange={() => togglePref('habitReminders')} /> Habit Reminders</label>
        <label><input type="checkbox" checked={preferences.studyReminders} onChange={() => togglePref('studyReminders')} /> Study Reminders</label>
      </section>

      <section className="panel data-panel">
        <h2>Data</h2>
        <button type="button" onClick={handleExport}>Export Data</button>
        <button type="button" onClick={handleBackup}>Backup Data</button>
        <button type="button" onClick={handleRestore}>Restore Data</button>
        {status && <p className="status-message">{status}</p>}
      </section>
    </div>
  )
}

export default Settings;
