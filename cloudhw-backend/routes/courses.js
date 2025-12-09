import db from "../db.js";
import express from "express";

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM curses WHERE username = ?",
      [username]
    );

    res.json({ courses: rows });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo cursos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cursoname, teachername, rgbcolor, username } = req.body;

    await db.query(
      "INSERT INTO curses (cursoname, teachername, rgbcolor, username) VALUES (?,?,?,?)",
      [cursoname, teachername, rgbcolor, username]
    );

    res.json({ message: "Curso creado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error creando el curso" });
  }
});
export default router;