import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Tareas() {
  const navigate = useNavigate()
  const username = localStorage.getItem("cloudhw-username")

  // Tasks & courses
  const [tasks, setTasks] = useState([])
  const [courses, setCourses] = useState([])

  // Bucket / archivos
  const [bucketFiles, setBucketFiles] = useState([])
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Create / Edit modals & fields
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [newTaskMateria, setNewTaskMateria] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')

  const [editTask, setEditTask] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('cloudhw-loggedin') !== 'true') {
      navigate('/login')
    }

    // Cargar cursos (los mantienes en localStorage)
    const savedCourses = localStorage.getItem('cloudhw-courses')
    if (savedCourses) setCourses(JSON.parse(savedCourses))

    // Cargar tareas y archivos
    fetchTasks()
    fetchBucketFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -----------------------
  // TASKS (MySQL via API)
  // -----------------------
  const fetchTasks = async () => {
    if (!username) return
    try {
      const res = await fetch(`http://3.19.64.159:3001/homework/${username}`)
      const data = await res.json()
      setTasks(data.homework || [])
    } catch (err) {
      console.error("Error cargando tareas:", err)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskMateria || !newTaskDesc || !newTaskDate) {
      alert("Completa todos los campos")
      return
    }

    try {
      const payload = {
        hwname: newTaskMateria,
        hwdesc: newTaskDesc,
        date: newTaskDate,
        username
      }

      const res = await fetch("http://3.19.64.159:3001/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        console.error("Error creando tarea", await res.text())
        alert("Error creando tarea")
        return
      }

      setIsCreateModalOpen(false)
      setNewTaskMateria('')
      setNewTaskDesc('')
      setNewTaskDate('')
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert("Error creando tarea")
    }
  }

  const handleDeleteTask = async (hwname) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return
    try {
      const res = await fetch("http://3.19.64.159:3001/homework", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hwname, username })
      })

      if (!res.ok) {
        console.error("Error eliminando tarea", await res.text())
        alert("Error eliminando tarea")
        return
      }

      fetchTasks()
    } catch (err) {
      console.error(err)
      alert("Error eliminando tarea")
    }
  }

  const openEditModal = (task) => {
    setEditTask(task)
    setNewTaskMateria(task.hwname)
    setNewTaskDesc(task.hwdesc)
    // date puede venir como 'YYYY-MM-DD' o con time; normalizamos
    setNewTaskDate(task.date ? task.date.split('T')[0] : '')
    setIsEditModalOpen(true)
  }

  const handleEditTask = async (e) => {
    e.preventDefault()
    if (!editTask) return

    try {
      const payload = {
        oldName: editTask.hwname,
        hwname: newTaskMateria,
        hwdesc: newTaskDesc,
        date: newTaskDate,
        username
      }

      const res = await fetch("http://3.19.64.159:3001/homework", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        console.error("Error editando tarea", await res.text())
        alert("Error editando tarea")
        return
      }

      setIsEditModalOpen(false)
      setEditTask(null)
      setNewTaskMateria('')
      setNewTaskDesc('')
      setNewTaskDate('')
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert("Error editando tarea")
    }
  }

  // -----------------------
  // BUCKET (files) — funciones que faltaban
  // -----------------------
  const fetchBucketFiles = async () => {
    if (!username) return
    try {
      const response = await fetch(`http://3.19.64.159:3001/files/list/${username}`)
      const data = await response.json()
      setBucketFiles(data.files || [])
    } catch (error) {
      console.error("Error cargando archivos del bucket:", error)
    }
  }

  const handleDownload = (filename) => {
    window.open(`http://3.19.64.159:3001/files/download/${username}/${filename}`, "_blank")
  }

  const handleDelete = async (filename) => {
    if (!window.confirm(`¿Eliminar archivo ${filename}?`)) return
    try {
      const res = await fetch(`http://3.19.64.159:3001/files/delete/${username}/${filename}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        console.error("Error al eliminar archivo", await res.text())
        alert("Error al eliminar")
        return
      }

      alert("Archivo eliminado")
      fetchBucketFiles()
    } catch (error) {
      console.error(error)
      alert("Error al eliminar archivo")
    }
  }

  const handleUploadFile = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Selecciona un archivo")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("username", username)

    try {
      const res = await fetch("http://3.19.64.159:3001/files/upload", {
        method: "POST",
        body: formData
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (err) {
        console.error("Respuesta no JSON al subir archivo:", text)
        alert("El servidor respondió con formato inesperado.")
        return
      }

      if (!res.ok) {
        console.error("Error subiendo archivo:", data)
        alert("Error subiendo archivo")
        return
      }

      alert(`Archivo subido: ${data.filename}`)
      setIsFileModalOpen(false)
      setSelectedFile(null)
      fetchBucketFiles()
    } catch (err) {
      console.error(err)
      alert("Error subiendo archivo")
    }
  }

  // -----------------------
  // RENDER
  // -----------------------
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="main-header">
          <h1>Mis Tareas</h1>
          <button className="add-course-btn" onClick={() => setIsCreateModalOpen(true)}>
            + Nueva Tarea
          </button>
        </div>

        <div className="tasks-container">
          {tasks.length > 0 ? (
            <ul className="task-full-list">
              {tasks.map((task) => (
                <li key={task.hwname + (task.date || '')} className="task-full-item">
                  <div className="task-info">
                    <h3>{task.hwname}</h3>
                    <p>{task.hwdesc}</p>
                    <span className="task-date">📅 {task.date ? task.date.split('T')[0] : ''}</span>
                  </div>

                  <div className="task-actions">
                    <button className="edit-btn" onClick={() => openEditModal(task)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDeleteTask(task.hwname)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No hay tareas.</p>
            </div>
          )}
        </div>

        <div className="bucket-container">
          <h2>Mis Archivos en el Bucket</h2>
          <button className="add-course-btn" onClick={() => setIsFileModalOpen(true)}>Subir Archivo</button>

          {bucketFiles.length > 0 ? (
            <ul className="bucket-list">
              {bucketFiles.map((file, index) => (
                <li key={index} className="bucket-item">
                  📄 {file}
                  <button className="download-btn" onClick={() => handleDownload(file)} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    Descargar
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(file)}>Eliminar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay archivos guardados.</p>
          )}
        </div>
      </main>

      {/* Modal Subir Archivo */}
      {isFileModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFileModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Subir Archivo</h2>
            <form onSubmit={handleUploadFile} className="modal-form">
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsFileModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Subir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Tarea */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nueva Tarea</h2>
            <form onSubmit={handleCreateTask} className="modal-form">
              <select value={newTaskMateria} onChange={(e) => setNewTaskMateria(e.target.value)} className="modal-input">
                <option value="">Selecciona materia</option>
                <option value="Sin curso">Sin curso</option>
                {courses.map((course, idx) => (
                  <option key={idx} value={course.nombre}>{course.nombre}</option>
                ))}
              </select>

              <input type="text" className="modal-input" placeholder="Descripción" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} />
              <input type="date" className="modal-input" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Tarea */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Tarea</h2>
            <form onSubmit={handleEditTask} className="modal-form">
              <input type="text" value={newTaskMateria} onChange={(e) => setNewTaskMateria(e.target.value)} />
              <input type="text" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} />
              <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tareas