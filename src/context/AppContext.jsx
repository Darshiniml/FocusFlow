import { useMemo, useState } from 'react'
import { AppContext } from './AppContextInstance'

const initialTasks = []

const initialHabits = []

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks)
  const [habits, setHabits] = useState(initialHabits)
  const [habitLogs, setHabitLogs] = useState([]) // { id, habitId, date: 'yyyy-mm-dd' }

  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), completed: false, completedAt: null, createdAt: new Date().toISOString(), ...task },
    ])
  }

  const updateTask = (id, changes) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...changes } : task)))
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== id) return task
      const completed = !task.completed
      return {
        ...task,
        completed,
        completedAt: completed ? new Date().toISOString().slice(0, 10) : null,
      }
    }))
  }

  const completeTasksOnDate = (date) => {
    setTasks((prev) => prev.map((task) => {
      if (task.dueDate === date && !task.completed) {
        return { ...task, completed: true, completedAt: date }
      }
      return task
    }))
  }

  const uncompleteTasksOnDate = (date) => {
    setTasks((prev) => prev.map((task) => {
      if (task.completedAt === date) {
        return { ...task, completed: false, completedAt: null }
      }
      return task
    }))
  }

  const clearHabitLogsOnDate = (date) => {
    setHabitLogs((prev) => prev.filter((log) => log.date !== date))
  }

  const addHabit = (title) => {
    if (!title?.trim()) return
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), title: title.trim(), active: false },
    ])
  }

  const toggleHabit = (id) => {
    setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, active: !habit.active } : habit)))
  }

  const logHabitOnDate = (habitId, date) => {
    // date must be 'yyyy-mm-dd'
    setHabitLogs((prev) => {
      const exists = prev.find((h) => h.habitId === habitId && h.date === date)
      if (exists) return prev.filter((h) => !(h.habitId === habitId && h.date === date))
      return [...prev, { id: Date.now(), habitId, date }]
    })
  }

  const dashboardStats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    const pendingTasks = totalTasks - completedTasks
    const productivity = totalTasks ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%'
    const currentStreak = `${habits.filter((habit) => habit.active).length}d`
    const focusHours = `${(completedTasks * 0.5).toFixed(1)}h`

    return { totalTasks, completedTasks, pendingTasks, productivity, currentStreak, focusHours }
  }, [tasks, habits])

  return (
    <AppContext.Provider
      value={{
        tasks,
        habits,
        habitLogs,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        completeTasksOnDate,
        uncompleteTasksOnDate,
        clearHabitLogsOnDate,
        addHabit,
        toggleHabit,
        logHabitOnDate,
        dashboardStats,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
