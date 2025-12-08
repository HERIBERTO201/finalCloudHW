import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function Navbar() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = localStorage.getItem('cloudhw-username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('cloudhw-loggedin')
    localStorage.removeItem('cloudhw-username')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="CloudHW Logo" className="nav-logo" />
        <div className="nav-links">
          <NavLink to="/dashboard" end>Inicio</NavLink>
          <NavLink to="/cursos">Mis Cursos</NavLink>
          <NavLink to="/tareas">Tareas</NavLink>
          <NavLink to="/calendario">Calendario</NavLink> 
        </div>
      </div>
      <div className="nav-right">
        <div className="user-info">
          <span>👤</span>
          Hola, {username}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar