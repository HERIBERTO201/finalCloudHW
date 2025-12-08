import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {

        localStorage.setItem("cloudhw-loggedin", "true")
        localStorage.setItem("cloudhw-username", data.username)

        navigate("/dashboard")   // ← LOGIN exitoso
      } else {
        alert(data.message || "Credenciales incorrectas.")
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      alert("No se pudo conectar con el servidor.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="CloudHW Logo" className="auth-logo" />
        <h2>Iniciar Sesión A</h2>

        <form onSubmit={handleSubmit}>
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
            Iniciar Sesión
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
