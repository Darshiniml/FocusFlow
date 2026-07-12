import { useState } from 'react'

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' })
  const [theme, setTheme] = useState('dark')
  const [preferences, setPreferences] = useState({ notifications: true, taskReminders: false, habitReminders: false, studyReminders: false })
  const [status, setStatus] = useState('')

  const handleChange = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }))
  const togglePref = (key) => setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  const handleAction = (action) => setStatus(`${action} completed`)

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
        <button type="button" onClick={() => handleAction('Export')}>Export Data</button>
        <button type="button" onClick={() => handleAction('Backup')}>Backup Data</button>
        <button type="button" onClick={() => handleAction('Restore')}>Restore Data</button>
        {status && <p className="status-message">{status}</p>}
      </section>
    </div>
  )
}

export default Settings;
