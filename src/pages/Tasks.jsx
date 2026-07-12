import { useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { toDateKey } from '../utils/date'

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useAppContext()
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', category: 'Study', dueDate: '' })

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks
    if (filter === 'Pending') return tasks.filter((task) => !task.completed)
    if (filter === 'Completed') return tasks.filter((task) => task.completed)
    if (filter === 'High Priority') return tasks.filter((task) => task.priority === 'High')
    if (filter === "Today's Tasks") return tasks.filter((task) => task.dueDate === toDateKey())
    return tasks
  }, [filter, tasks])

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleAdd = () => {
    if (!form.title.trim()) return
    addTask(form)
    setForm({ title: '', description: '', priority: 'Medium', category: 'Study', dueDate: '' })
  }

  const editTask = (id) => {
    const task = tasks.find((task) => task.id === id)
    const title = window.prompt('Edit task title', task?.title || '')
    if (title) updateTask(id, { title })
  }

  return (
    <div className="page tasks-page">
      <header className="page-header">
        <h1>Tasks</h1>
        <p>Manage your tasks, filter priorities, and track what needs to be done today.</p>
      </header>

      <section className="panel task-form-panel">
        <h2>Task Creation Form</h2>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Task Title<input type="text" value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder="Enter title" /></label>
          <label>Description<textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} placeholder="Describe the task" /></label>
          <label>Priority<select value={form.priority} onChange={(event) => handleChange('priority', event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Category<select value={form.category} onChange={(event) => handleChange('category', event.target.value)}><option>Study</option><option>Placement</option><option>Projects</option><option>Personal</option><option>Health</option></select></label>
          <label>Due Date<input type="date" value={form.dueDate} onChange={(event) => handleChange('dueDate', event.target.value)} /></label>
          <button type="button" onClick={handleAdd}>Add Task</button>
        </form>
      </section>

      <section className="panel task-filters-panel">
        <h2>Task Filters</h2>
        <div className="filter-list">
          {['All', 'Pending', 'Completed', 'High Priority', "Today's Tasks"].map((name) => (
            <button key={name} type="button" className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>{name}</button>
          ))}
        </div>
      </section>

      <section className="panel task-list-panel">
        <h2>Task List ({filteredTasks.length})</h2>
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed-task' : ''}>
              <span>{task.completed ? '☑' : '☐'} {task.title} <small>({task.priority})</small></span>
              <div className="task-actions">
                <button type="button" onClick={() => editTask(task.id)}>Edit</button>
                <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
                <button type="button" onClick={() => toggleTaskCompletion(task.id)}>{task.completed ? 'Mark Pending' : 'Mark Complete'}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Tasks;
