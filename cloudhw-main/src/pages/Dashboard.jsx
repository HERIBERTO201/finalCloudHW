import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

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

  useEffect(() => {
    const username = localStorage.getItem('cloudhw-username')
    if (!username) return

    const fetchData = async () => {
      try {
        // ------- HOMEWORK -------
        const resTasks = await fetch(`http://3.19.64.159:3001/homework/${username}`)
        const dataTasks = await resTasks.json()
        setTasks(dataTasks.homework)   // <-- USAR EL OBJETO CORRECTO

        // ------- EVENTS -------
        const resEvents = await fetch(`http://3.19.64.159:3001/events/${username}`)
        const dataEvents = await resEvents.json()
        setEvents(dataEvents.events)   // <-- USAR EL OBJETO CORRECTO

      } catch (error) {
        console.error("Error obteniendo datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

        {/* TAREAS */}
        <div className="widget-card">
          <h3>Tareas Pendientes</h3>

          <ul className="task-list">
            {tasks.length === 0 ? (
              <li className="task-item empty">No hay tareas pendientes</li>
            ) : (
              tasks.map((task, index) => (
                <li className="task-item" key={index}>
                  <label>
                    <strong>{task.hwname}</strong> — {task.hwdesc}
                    {task.date && <span>{task.date}</span>}
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* EVENTOS */}
        <div className="widget-card">
          <h3>Próximos Eventos</h3>

          <ul className="event-list">
            {events.length === 0 ? (
              <li className="event-item empty">No hay eventos próximos</li>
            ) : (
              events.map((ev, index) => (
                <li className="event-item" key={index}>
                  <span className="event-icon">🗓️</span>
                  <div className="event-details">
                    <strong>{ev.eventoName}</strong>
                    <span>{ev.date}</span>
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