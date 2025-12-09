import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener tareas por usuario
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM homework WHERE username = ?",
      [username]
    );

    res.json({ homework: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo tareas" });
  }
});

// Crear nueva tarea
router.post("/", async (req, res) => {
  try {
    const { hwname, hwdesc, date, username } = req.body;

    await db.query(
      "INSERT INTO homework (hwname, hwdesc, date, username) VALUES (?,?,?,?)",
      [hwname, hwdesc, date, username]
    );

    res.json({ message: "Tarea creada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando tarea" });
  }
});

// Eliminar tarea
router.delete("/", async (req, res) => {
  try {
    const { hwname, username } = req.body;

    await db.query(
      "DELETE FROM homework WHERE hwname = ? AND username = ? LIMIT 1",
      [hwname, username]
    );

    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando tarea" });
  }
});

// Editar tarea
router.put("/", async (req, res) => {
  try {
    const { oldName, hwname, hwdesc, date, username } = req.body;

    await db.query(
      "UPDATE homework SET hwname = ?, hwdesc = ?, date = ? WHERE hwname = ? AND username = ?",
      [hwname, hwdesc, date, oldName, username]
    );

    res.json({ message: "Tarea actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error editando tarea" });
  }
});

export default router;