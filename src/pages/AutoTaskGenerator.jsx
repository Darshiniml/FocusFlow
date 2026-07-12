import { useState } from 'react'
import { useAppContext } from '../context/useAppContext'

const AutoTaskGenerator = () => {
  const { addTask } = useAppContext()
  const [goal, setGoal] = useState('Learn Spring Boot')
  const [time, setTime] = useState('3 Hours')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [generatedTasks, setGeneratedTasks] = useState([
    { title: 'Setup Spring Boot Project', selected: true },
    { title: 'Learn Controllers', selected: true },
    { title: 'Learn Services', selected: true },
    { title: 'Learn JPA', selected: true },
    { title: 'Build CRUD App', selected: true },
  ])
  const [status, setStatus] = useState('')

  const generate = () => {
    setGeneratedTasks([
      { title: `Setup ${goal} Project`, selected: true },
      { title: `Learn ${difficulty} Controllers`, selected: true },
      { title: `Learn ${difficulty} Services`, selected: true },
      { title: `Learn JPA`, selected: true },
      { title: `Build CRUD App`, selected: true },
    ])
    setStatus('Tasks generated successfully')
  }

  const toggleTask = (index) => {
    setGeneratedTasks((prev) => prev.map((task, idx) => idx === index ? { ...task, selected: !task.selected } : task))
  }

  const addAll = () => {
    generatedTasks.forEach((task) => addTask({ title: task.title, priority: 'Medium', category: 'Study', dueDate: '' }))
    setStatus(`${generatedTasks.length} tasks added`)
  }

  const addSelected = () => {
    const selectedTasks = generatedTasks.filter((task) => task.selected)
    selectedTasks.forEach((task) => addTask({ title: task.title, priority: 'Medium', category: 'Study', dueDate: '' }))
    setStatus(`${selectedTasks.length} selected tasks added`)
  }

  return (
    <div className="page auto-task-page">
      <header className="page-header">
        <h1>Auto Task Generator</h1>
        <p>Generate task suggestions automatically from your goals and available time.</p>
      </header>

      <section className="panel generator-panel">
        <h2>User Input</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Goal:<input value={goal} onChange={(event) => setGoal(event.target.value)} type="text" placeholder="Learn Spring Boot" /></label>
          <label>Available Time:<input value={time} onChange={(event) => setTime(event.target.value)} type="text" placeholder="3 Hours" /></label>
          <label>Difficulty:<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <button type="button" onClick={generate}>Generate Tasks</button>
        </form>
      </section>

      <section className="panel generated-panel">
        <h2>Generated Tasks</h2>
        <ol>
          {generatedTasks.map((task, index) => (
            <li key={task.title}>
              <label>
                <input type="checkbox" checked={task.selected} onChange={() => toggleTask(index)} /> {task.title}
              </label>
            </li>
          ))}
        </ol>
        <div className="task-actions">
          <button type="button" onClick={addSelected}>Add Selected Tasks</button>
          <button type="button" onClick={addAll}>Add All Tasks</button>
        </div>
        {status && <p className="status-message">{status}</p>}
      </section>
    </div>
  )
}

export default AutoTaskGenerator;
