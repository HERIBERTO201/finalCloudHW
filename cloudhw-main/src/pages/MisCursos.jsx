import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MisCursos() {
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [newCourseName, setNewCourseName] = useState('')
  const [newCourseProf, setNewCourseProf] = useState('')
  const [newCourseColor, setNewCourseColor] = useState('#2D63D0')

  const username = localStorage.getItem('cloudhw-username')

  // Redirección si no está loggeado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('cloudhw-loggedin')
    if (isLoggedIn !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  // Obtener cursos desde el backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://3.19.64.159:3001/courses/${username}`)
        const data = await res.json()

        if (res.ok) {
          setCourses(data.courses)
        } else {
          console.error(data)
        }
      } catch (err) {
        console.error("Error obteniendo cursos:", err)
      }
      setIsLoading(false)
    }

    if (username) {
      fetchCourses()
    }
  }, [username])

  // Guardar curso en el backend
  const handleAddCourse = async (e) => {
    e.preventDefault()

    if (!newCourseName || !newCourseProf) {
      alert('Por favor, completa el nombre y el profesor.')
      return
    }

    const newCourse = {
      cursoname: newCourseName,
      teachername: newCourseProf,
      rgbcolor: newCourseColor,
      username: username
    }

    try {
      const res = await fetch("http://3.19.64.159:3001/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse)
      })

      const data = await res.json()

      if (!res.ok) {
        alert("Error al guardar el curso")
        return
      }

      // Actualizar UI dinámicamente
      setCourses([...courses, newCourse])

      // Limpiar modal
      setNewCourseName('')
      setNewCourseProf('')
      setNewCourseColor('#2D63D0')
      setIsModalOpen(false)

    } catch (err) {
      console.error("Error creando curso:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <h1>Cargando cursos...</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="layout">
      <Navbar />

      <main className="main-content">
        <div className="main-header">
          <h1>Mis Cursos</h1>
          <button className="add-course-btn" onClick={() => setIsModalOpen(true)}>
            + Agregar Curso
          </button>
        </div>

        {courses.length > 0 ? (
          <div className="course-grid">
            {courses.map((course, index) => (
              <div className="course-card" key={index}>
                <div
                  className="course-card-header"
                  style={{ backgroundColor: course.rgbcolor }}
                ></div>
                <div className="course-card-body">
                  <h3>{course.cursoname}</h3>
                  <p>{course.teachername}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tienes cursos registrados.</p>
            <p>¡Empieza agregando tu primero!</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo Curso</h2>
            <form onSubmit={handleAddCourse} className="modal-form">
              <label htmlFor="courseName">Nombre del curso:</label>
              <input
                id="courseName"
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Ej. Cálculo Integral"
              />

              <label htmlFor="courseProf">Profesor o Profesora:</label>
              <input
                id="courseProf"
                type="text"
                value={newCourseProf}
                onChange={(e) => setNewCourseProf(e.target.value)}
                placeholder="Ej. Dr. Juan López"
              />

              <label htmlFor="courseColor">Elige un color:</label>
              <input
                id="courseColor"
                type="color"
                value={newCourseColor}
                onChange={(e) => setNewCourseColor(e.target.value)}
                className="color-input"
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MisCursos