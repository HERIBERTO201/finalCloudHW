import express from "express"
import db from "../db.js"

const router = express.Router()

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params
    const [rows] = await db.query(
      "SELECT eventoName, date FROM eventos WHERE username = ?",
      [username]
    )

    res.json({ events: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error obteniendo eventos" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { eventoName, date, username } = req.body

    if (!eventoName || !date || !username) {
      return res.status(400).json({ error: "Faltan datos" })
    }

    await db.query(
      "INSERT INTO eventos (eventoName, date, username) VALUES (?,?,?)",
      [eventoName, date, username]
    )

    res.json({ message: "Evento guardado correctamente" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error creando evento" })
  }
})

export default router
