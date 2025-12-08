import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png' 

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !email || !password) {
      alert("Por favor, completa todos los campos.")
      return
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("¡Registro exitoso! Carpeta creada en S3.")
        navigate('/login')
      } else {
        alert(data.message || "Error en el registro.")
      }
    } catch (error) {
      console.error(error)
      alert("Error conectando al servidor.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="CloudHW Logo" className="auth-logo" />
        <h2>Registro de Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span>👤</span>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span>📧</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn">
            Registrarse
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
