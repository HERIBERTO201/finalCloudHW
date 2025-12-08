import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CALENDAR_STORAGE_KEY = 'cloudhw-calendar-events'

function Calendario() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateKey, setSelectedDateKey] = useState(null)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [loaded, setLoaded] = useState(false)

  // Redirección si no está logueado
  useEffect(() => {
    if (localStorage.getItem('cloudhw-loggedin') !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  // Cargar eventos almacenados
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CALENDAR_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          setEvents(parsed)
        }
      }
    } catch (err) {
      console.error("Error cargando calendario:", err)
    }
    setLoaded(true)
  }, [])

  // Guardar eventos del calendario
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events))
    }
  }, [events, loaded])

  // Sincronizar calendario con dashboard
  const syncEventsToDashboard = () => {
    const saved = localStorage.getItem(CALENDAR_STORAGE_KEY)

    if (!saved) {
      localStorage.setItem("cloudhw-events", JSON.stringify([]))
      return
    }

    let parsed = {}
    try {
      parsed = JSON.parse(saved)
    } catch (e) {
      console.error("Error leyendo calendario:", e)
      return
    }

    const transformed = []

    Object.keys(parsed).forEach(dateKey => {
      const [year, month, day] = dateKey.split("-")

      parsed[dateKey].forEach(titulo => {
        transformed.push({
          id: transformed.length + 1,
          titulo,
          fecha: `${day}/${parseInt(month)}/${year}`
        })
      })
    })

    localStorage.setItem("cloudhw-events", JSON.stringify(transformed))
  }

  // Sync automático al cargar
  useEffect(() => {
    if (loaded) {
      syncEventsToDashboard()
    }
  }, [loaded])

  // Guardar evento nuevo
  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!newEventTitle.trim()) return

    const prev = Array.isArray(events[selectedDateKey]) ? events[selectedDateKey] : []

    const updated = {
      ...events,
      [selectedDateKey]: [...prev, newEventTitle.trim()]
    }

    setEvents(updated)

    // Sincroniza con dashboard
    setTimeout(() => syncEventsToDashboard(), 50)

    setIsModalOpen(false)
  }

  // Calcular datos del mes
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1))
  }

  const handleDayClick = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDateKey(key)
    setNewEventTitle('')
    setIsModalOpen(true)
  }

  return (
    <div className="layout">
      <Navbar />

      <main className="main-content">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>❮ Anterior</button>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={() => changeMonth(1)}>Siguiente ❯</button>
        </div>

        <div className="calendar-grid">
          <div className="weekday">Dom</div>
          <div className="weekday">Lun</div>
          <div className="weekday">Mar</div>
          <div className="weekday">Mié</div>
          <div className="weekday">Jue</div>
          <div className="weekday">Vie</div>
          <div className="weekday">Sáb</div>

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="calendar-day empty"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = events[key] || []

            const today = new Date()
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear()

            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{day}</span>

                <div className="day-events">
                  {dayEvents.map((ev, idx) => (
                    <div key={idx} className="event-dot" title={ev}>
                      {ev}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Agregar Evento</h3>
            <form onSubmit={handleSaveEvent} className="modal-form">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendario