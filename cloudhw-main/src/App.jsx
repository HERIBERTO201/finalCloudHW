import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MisCursos from './pages/MisCursos'
import Calendario from './pages/Calendario' 
import Tareas from './pages/Tareas' 

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login/>} /> 
      <Route path="/login" element={<Login/>} /> 
      <Route path="/cursos" element={<MisCursos />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/tareas" element={<Tareas />} />
    </Routes>
  )
}

export default App