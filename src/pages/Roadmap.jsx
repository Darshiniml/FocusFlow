import { useMemo, useState } from 'react'

const Roadmap = () => {
  const [steps, setSteps] = useState([
    { title: 'Resume', done: true },
    { title: 'Java Basics', done: true },
    { title: 'OOP', done: true },
    { title: 'Collections', done: true },
    { title: 'JDBC', done: true },
    { title: 'Spring Boot', done: false },
    { title: 'DSA 100 Questions', done: false },
    { title: 'Mock Interviews', done: false },
    { title: 'HR Preparation', done: false },
  ])

  const [skills] = useState([
    { label: 'Java', value: 90 },
    { label: 'DSA', value: 65 },
    { label: 'SQL', value: 80 },
    { label: 'Projects', value: 85 },
    { label: 'Communication', value: 70 },
  ])

  const toggleStep = (index) => {
    setSteps((items) => items.map((step, idx) => idx === index ? { ...step, done: !step.done } : step))
  }

  const readiness = useMemo(() => {
    const completed = steps.filter((step) => step.done).length
    return Math.round((completed / steps.length) * 100)
  }, [steps])

  return (
    <div className="page roadmap-page">
      <header className="page-header">
        <div>
          <h1>Placement Roadmap</h1>
          <p>Track your career readiness, skill progress, and upcoming goals.</p>
        </div>
      </header>

      <section className="panel roadmap-summary-panel">
        <div>
          <h2>Placement Readiness</h2>
          <p className="muted">How close you are to your placement target.</p>
        </div>
        <div className="readiness-score">
          <strong>{readiness}%</strong>
          <div className="progress-bar"><span style={{ width: `${readiness}%` }} /></div>
        </div>
      </section>

      <section className="panel roadmap-steps-panel">
        <div className="panel-header">
          <h2>Roadmap Steps</h2>
          <span className="muted">Tap a step to mark it done / undone.</span>
        </div>
        <ul>
          {steps.map((step, index) => (
            <li key={step.title} className={step.done ? 'step-done-item' : ''}>
              <button type="button" className="roadmap-step-button" onClick={() => toggleStep(index)}>
                <span className="step-status">{step.done ? '✓' : '☐'}</span>
                <span>{step.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel skills-panel">
        <div className="panel-header">
          <h2>Skill Progress</h2>
          <span className="muted">Visualize your strengths and growth areas.</span>
        </div>
        <ul className="skill-list">
          {skills.map((skill) => (
            <li key={skill.label} className="skill-row">
              <span>{skill.label}</span>
              <div className="skill-bar">
                <span style={{ width: `${skill.value}%` }} />
              </div>
              <strong>{skill.value}%</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel goals-panel">
        <div className="panel-header">
          <h2>Upcoming Goals</h2>
          <button type="button" className="btn btn-secondary">Add Goal</button>
        </div>
        <ul className="goal-list">
          <li>Complete Spring Boot</li>
          <li>Solve 50 More DSA Questions</li>
          <li>Attend Mock Interview</li>
        </ul>
      </section>
    </div>
  )
}

export default Roadmap;
