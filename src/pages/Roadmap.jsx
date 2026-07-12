import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'

const Roadmap = () => {
  const { roadmapSteps, roadmapSkills, roadmapGoals, toggleRoadmapStep, addRoadmapGoal, removeRoadmapGoal } = useAppContext()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [goalText, setGoalText] = useState('')

  const readiness = useMemo(() => {
    const completed = roadmapSteps.filter((step) => step.done).length
    return Math.round((completed / roadmapSteps.length) * 100)
  }, [roadmapSteps])

  const handleAddGoal = () => {
    if (!goalText.trim()) return
    addRoadmapGoal(goalText)
    setGoalText('')
    setShowAddGoal(false)
  }

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
          {roadmapSteps.map((step, index) => (
            <li key={step.title} className={step.done ? 'step-done-item' : ''}>
              <button type="button" className="roadmap-step-button" onClick={() => toggleRoadmapStep(index)}>
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
          {roadmapSkills.map((skill) => (
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
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddGoal((prev) => !prev)}>Add Goal</button>
        </div>

        {showAddGoal && (
          <form onSubmit={(event) => event.preventDefault()} className="add-goal-form">
            <input value={goalText} onChange={(event) => setGoalText(event.target.value)} type="text" placeholder="e.g. Finish 2 mock interviews" />
            <button type="button" onClick={handleAddGoal}>Add</button>
          </form>
        )}

        <ul className="goal-list">
          {roadmapGoals.length ? roadmapGoals.map((goal) => (
            <li key={goal.id}>
              <span>{goal.text}</span>
              <button type="button" className="goal-remove" onClick={() => removeRoadmapGoal(goal.id)} title="Remove goal">×</button>
            </li>
          )) : <li className="empty">No goals yet</li>}
        </ul>
      </section>
    </div>
  )
}

export default Roadmap;
