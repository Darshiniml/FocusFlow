import { useEffect, useMemo } from 'react'
import { AppContext } from './AppContextInstance'
import { usePersistedState } from '../hooks/usePersistedState'
import { toDateKey } from '../utils/date'

const defaultTasks = []

const defaultHabits = []

const defaultStudySessions = [
  { id: 1, subject: 'Java', topic: 'Collections', duration: 2, date: '2026-08-15' },
  { id: 2, subject: 'DSA', topic: 'Arrays', duration: 1.5, date: '2026-08-14' },
  { id: 3, subject: 'SQL', topic: 'Joins', duration: 1, date: '2026-08-13' },
]

const defaultTimetableSlots = [
  { id: 1, day: 'Monday', time: '6 AM', label: 'Exercise' },
  { id: 2, day: 'Tuesday', time: '8 AM', label: 'College' },
  { id: 3, day: 'Tuesday', time: '10 AM', label: 'Group Study' },
  { id: 4, day: 'Wednesday', time: '7 PM', label: 'DSA Practice' },
  { id: 5, day: 'Wednesday', time: '5 PM', label: 'Project Work' },
  { id: 6, day: 'Thursday', time: '6 PM', label: 'Lecture' },
  { id: 7, day: 'Thursday', time: '2 PM', label: 'Lab' },
  { id: 8, day: 'Friday', time: '8 AM', label: 'Revision' },
  { id: 9, day: 'Friday', time: '6 PM', label: 'Mock Interview' },
  { id: 10, day: 'Saturday', time: '10 AM', label: 'Review' },
  { id: 11, day: 'Sunday', time: '11 AM', label: 'Catchup' },
]

const defaultRoadmapSteps = [
  { title: 'Resume', done: true },
  { title: 'Java Basics', done: true },
  { title: 'OOP', done: true },
  { title: 'Collections', done: true },
  { title: 'JDBC', done: true },
  { title: 'Spring Boot', done: false },
  { title: 'DSA 100 Questions', done: false },
  { title: 'Mock Interviews', done: false },
  { title: 'HR Preparation', done: false },
]

const defaultRoadmapSkills = [
  { label: 'Java', value: 90 },
  { label: 'DSA', value: 65 },
  { label: 'SQL', value: 80 },
  { label: 'Projects', value: 85 },
  { label: 'Communication', value: 70 },
]

const defaultRoadmapGoals = [
  { id: 1, text: 'Complete Spring Boot' },
  { id: 2, text: 'Solve 50 More DSA Questions' },
  { id: 3, text: 'Attend Mock Interview' },
]

const defaultProfile = { name: '', email: '', avatar: '' }

const defaultPreferences = { notifications: true, taskReminders: false, habitReminders: false, studyReminders: false }

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = usePersistedState('focusflow-tasks', defaultTasks)
  const [habits, setHabits] = usePersistedState('focusflow-habits', defaultHabits)
  const [habitLogs, setHabitLogs] = usePersistedState('focusflow-habit-logs', []) // { id, habitId, date: 'yyyy-mm-dd' }
  const [theme, setTheme] = usePersistedState('focusflow-theme', 'dark') // 'light' | 'dark'
  const [studySessions, setStudySessions] = usePersistedState('focusflow-study-sessions', defaultStudySessions)
  const [timetableSlots, setTimetableSlots] = usePersistedState('focusflow-timetable-slots', defaultTimetableSlots)
  const [roadmapSteps, setRoadmapSteps] = usePersistedState('focusflow-roadmap-steps', defaultRoadmapSteps)
  const [roadmapSkills, setRoadmapSkills] = usePersistedState('focusflow-roadmap-skills', defaultRoadmapSkills)
  const [roadmapGoals, setRoadmapGoals] = usePersistedState('focusflow-roadmap-goals', defaultRoadmapGoals)
  const [profile, setProfile] = usePersistedState('focusflow-profile', defaultProfile)
  const [preferences, setPreferences] = usePersistedState('focusflow-preferences', defaultPreferences)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ---- Tasks ----
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
        completedAt: completed ? toDateKey() : null,
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

  // ---- Habits ----
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

  // ---- Study sessions ----
  const addStudySession = (session) => {
    setStudySessions((prev) => [...prev, { id: Date.now(), ...session }])
  }

  // ---- Timetable ----
  const addTimetableSlot = (slot) => {
    setTimetableSlots((prev) => [...prev, { id: Date.now(), ...slot }])
  }

  const removeTimetableSlot = (id) => {
    setTimetableSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  const autoGenerateTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const pendingTasks = tasks.filter((task) => !task.completed)
    if (!pendingTasks.length) return 0

    let added = 0
    setTimetableSlots((prev) => {
      const next = [...prev]
      // Fill days that don't have a slot yet, one pending task per day, in order.
      const daysWithSlots = new Set(prev.map((slot) => slot.day))
      const availableDays = days.filter((day) => !daysWithSlots.has(day))
      const toPlace = pendingTasks.slice(0, availableDays.length)

      toPlace.forEach((task, index) => {
        next.push({ id: Date.now() + index, day: availableDays[index], time: 'Evening', label: task.title })
        added += 1
      })

      return next
    })
    return added
  }

  // ---- Roadmap ----
  const toggleRoadmapStep = (index) => {
    setRoadmapSteps((items) => items.map((step, idx) => (idx === index ? { ...step, done: !step.done } : step)))
  }

  const addRoadmapGoal = (text) => {
    if (!text?.trim()) return
    setRoadmapGoals((prev) => [...prev, { id: Date.now(), text: text.trim() }])
  }

  const removeRoadmapGoal = (id) => {
    setRoadmapGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  // ---- Backup / restore / export ----
  const getSnapshot = () => ({
    tasks,
    habits,
    habitLogs,
    studySessions,
    timetableSlots,
    roadmapSteps,
    roadmapSkills,
    roadmapGoals,
    profile,
    preferences,
    theme,
    exportedAt: new Date().toISOString(),
  })

  const restoreSnapshot = (snapshot) => {
    if (!snapshot) return
    if (Array.isArray(snapshot.tasks)) setTasks(snapshot.tasks)
    if (Array.isArray(snapshot.habits)) setHabits(snapshot.habits)
    if (Array.isArray(snapshot.habitLogs)) setHabitLogs(snapshot.habitLogs)
    if (Array.isArray(snapshot.studySessions)) setStudySessions(snapshot.studySessions)
    if (Array.isArray(snapshot.timetableSlots)) setTimetableSlots(snapshot.timetableSlots)
    if (Array.isArray(snapshot.roadmapSteps)) setRoadmapSteps(snapshot.roadmapSteps)
    if (Array.isArray(snapshot.roadmapSkills)) setRoadmapSkills(snapshot.roadmapSkills)
    if (Array.isArray(snapshot.roadmapGoals)) setRoadmapGoals(snapshot.roadmapGoals)
    if (snapshot.profile) setProfile(snapshot.profile)
    if (snapshot.preferences) setPreferences(snapshot.preferences)
    if (snapshot.theme) setTheme(snapshot.theme)
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
        theme,
        setTheme,
        studySessions,
        addStudySession,
        timetableSlots,
        addTimetableSlot,
        removeTimetableSlot,
        autoGenerateTimetable,
        roadmapSteps,
        roadmapSkills,
        roadmapGoals,
        toggleRoadmapStep,
        addRoadmapGoal,
        removeRoadmapGoal,
        profile,
        setProfile,
        preferences,
        setPreferences,
        getSnapshot,
        restoreSnapshot,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
