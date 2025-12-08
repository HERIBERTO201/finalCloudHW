import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const TASKS_STORAGE_KEY = 'cloudhw-tasks'
const EVENTS_STORAGE_KEY = 'cloudhw-events'

function Dashboard() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('cloudhw-loggedin')
    if (isLoggedIn !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  // Cargar datos del localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks([])
    }

    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents)
        if (Array.isArray(parsed)) {
          setEvents(parsed)
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error("Error al leer eventos:", err)
        setEvents([])
      }
    } else {
      setEvents([])
    }

    setIsLoading(false)
  }, [])

  // Guardar tareas (NO eventos)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    )
  }

  if (isLoading) {
    return (
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <h1>Cargando...</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">

        {/* Tareas */}
        <div className="widget-card">
          <h3>Tareas Pendientes</h3>

          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="task-item empty">No hay tareas pendientes</li>
            ) : (
              tasks.map(task => (
                <li
                  className={`task-item ${task.completada ? 'completed' : ''}`}
                  key={task.id}
                >
                  <input
                    type="checkbox"
                    checked={task.completada}
                    onChange={() => handleToggleTask(task.id)}
                  />
                  <label>
                    <strong>{task.materia}</strong> - {task.descripcion}
                    {task.fechaLimite && <span>{task.fechaLimite}</span>}
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Eventos */}
        <div className="widget-card">
          <h3>Próximos Eventos</h3>

          <ul className="event-list">
            {events.length === 0 ? (
              <li className="event-item empty">No hay eventos próximos</li>
            ) : (
              events.map(ev => (
                <li className="event-item" key={ev.id}>
                  <span className="event-icon">🗓️</span>
                  <div className="event-details">
                    <strong>{ev.titulo}</strong>
                    <span>{ev.fecha}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

      </main>
    </div>
  )
}

export default Dashboard
