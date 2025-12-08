import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
const TASKS_KEY = 'cloudhw-tasks'
const EVENTS_KEY = 'cloudhw-events'
const COURSES_STORAGE_KEY = 'cloudhw-courses'
function Tareas() {
  const navigate = useNavigate()
  const username = localStorage.getItem("cloudhw-username")
  const [tasks, setTasks] = useState([])
  const [courses, setCourses] = useState([])
  const [bucketFiles, setBucketFiles] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTaskMateria, setNewTaskMateria] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  useEffect(() => {
    if (localStorage.getItem('cloudhw-loggedin') !== 'true') {
      navigate('/login')
    }
    const savedTasks = localStorage.getItem(TASKS_KEY)
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    const savedCourses = localStorage.getItem(COURSES_STORAGE_KEY)
    if (savedCourses) setCourses(JSON.parse(savedCourses))
    fetchBucketFiles()
  }, [navigate])
  const fetchBucketFiles = async () => {
    if (!username) return
    try {
      const response = await fetch(`http://localhost:3001/files/list/${username}`)
      const data = await response.json()
      setBucketFiles(data.files || [])
    } catch (error) {
      console.error("Error cargando archivos del bucket:", error)
    }
  }
  const handleDelete = async (filename) => {
    if (!window.confirm(`¿Eliminar archivo ${filename}?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/files/delete/${username}/${filename}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error al eliminar");
        return;
      }
      alert("Archivo eliminado");
      fetchBucketFiles();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar archivo");
    }
  };
  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTaskMateria || !newTaskDesc || !newTaskDate) {
      alert("Completa todos los campos")
      return
    }
    const materiaNombre = newTaskMateria === 'sin-curso' ? 'Sin curso' : newTaskMateria
    const newTask = {
      id: Date.now(),
      materia: materiaNombre,
      descripcion: newTaskDesc,
      fechaLimite: `Fecha límite: ${newTaskDate.split('-').reverse().join('/')}`,
      fechaRaw: newTaskDate,
      completada: false,
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))
    const [y, m, d] = newTaskDate.split('-').map(Number)
    const calendarKey = `${y}-${m - 1}-${d}`
    const existingEvents = JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}')
    const newEventTitle = `${materiaNombre}: ${newTaskDesc}`
    existingEvents[calendarKey] = [...(existingEvents[calendarKey] || []), newEventTitle]
    localStorage.setItem(EVENTS_KEY, JSON.stringify(existingEvents))
    setIsCreateModalOpen(false)
    setNewTaskMateria('')
    setNewTaskDesc('')
    setNewTaskDate('')
  }
  const handleDownload = (filename) => {
  window.open(`http://localhost:3001/files/download/${username}/${filename}`, "_blank");
  };
  const handleUploadFile = async (e) => {
  e.preventDefault();
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("username", username);
  try {
    const res = await fetch("http://localhost:3001/files/upload", {
      method: "POST",
      body: formData,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return alert("El servidor respondió con un formato inválido. Revisa la consola.");
    }
    if (!res.ok) {
      alert("Error subiendo archivo");
      return;
    }
    alert(`Archivo subido: ${data.filename}`);
    setIsFileModalOpen(false);
    fetchBucketFiles();
  } catch (err) {
    console.error(err);
    alert("Error subiendo archivo");
  }
};
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
              {tasks.map(task => (
                <li key={task.id} className="task-full-item">
                  <div className="task-info">
                    <h3>{task.materia}</h3>
                    <p>{task.descripcion}</p>
                    <span className="task-date">📅 {task.fechaLimite}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No hay tareas pendientes.</p>
            </div>
          )}
        </div>
        <div className="bucket-container">
          <h2>Mis Archivos en el Bucket</h2>
          <button
            className="add-course-btn"
            onClick={() => setIsFileModalOpen(true)}
          >
            Subir Archivo
          </button>
          {bucketFiles.length > 0 ? (
            <ul className="bucket-list">
              {bucketFiles.map((file, index) => (
                <li key={index} className="bucket-item">
                  📄 {file}
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(file)}
                   style={{ marginLeft: '10px', marginRight: '10px' }}>
                    Descargar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay archivos guardados.</p>
          )}
        </div>
      </main>
      {isFileModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFileModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Crear Nueva Tarea</h2>
            <form onSubmit={handleCreateTask} className="modal-form">
              <select
                value={newTaskMateria}
                onChange={(e) => setNewTaskMateria(e.target.value)}
                className="modal-input"
              >
                <option value="">Selecciona materia</option>
                <option value="sin-curso">Sin curso</option>
                {courses.map((course, index) => (
                  <option key={index} value={course.nombre}>{course.nombre}</option>
                ))}
              </select>
              <input
                type="text"
                className="modal-input"
                placeholder="Descripción de la tarea"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
              <input
                type="date"
                className="modal-input"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default Tareas