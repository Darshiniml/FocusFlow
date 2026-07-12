import { useEffect, useMemo, useState } from 'react'

const modeDurations = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const formatTime = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remainder = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${remainder}`
}

const FocusTimer = () => {
  const [mode, setMode] = useState('focus')
  const [time, setTime] = useState(modeDurations.focus)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(3)

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setTime(modeDurations[nextMode])
    setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          setSessions((prev) => prev + 1)
          setRunning(false)
          return modeDurations[mode]
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, mode])

  const stats = useMemo(
    () => ({
      sessionsToday: sessions,
      focusHours: ((sessions * 25) / 60).toFixed(1) + 'h',
      weeklyFocus: ((sessions * 25) / 60 + 8).toFixed(1) + 'h',
    }),
    [sessions]
  )

  return (
    <div className="page focus-page">
      <header className="page-header">
        <h1>Focus Timer</h1>
        <p>Use the Pomodoro timer to power through focused work sessions.</p>
      </header>

      <section className="panel timer-panel">
        <h2>Pomodoro Timer</h2>
        <div className="timer-display">{formatTime(time)}</div>
        <div className="timer-controls">
          <button type="button" onClick={() => setRunning(true)}>Start</button>
          <button type="button" onClick={() => setRunning(false)}>Pause</button>
          <button type="button" onClick={() => setTime(modeDurations[mode])}>Reset</button>
        </div>
        <div className="timer-modes">
          <button type="button" className={mode === 'focus' ? 'active' : ''} onClick={() => changeMode('focus')}>Focus Session</button>
          <button type="button" className={mode === 'short' ? 'active' : ''} onClick={() => changeMode('short')}>Short Break</button>
          <button type="button" className={mode === 'long' ? 'active' : ''} onClick={() => changeMode('long')}>Long Break</button>
        </div>
      </section>

      <section className="panel timer-stats-panel">
        <h2>Statistics</h2>
        <ul>
          <li>Sessions Completed Today: {stats.sessionsToday}</li>
          <li>Focus Hours Today: {stats.focusHours}</li>
          <li>Weekly Focus Time: {stats.weeklyFocus}</li>
        </ul>
      </section>
    </div>
  )
}

export default FocusTimer;
