import express from "express";
import db from "../db.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// --------------------- REGISTER ---------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );

    // Crear carpeta en S3
    const folderName = `${username}/`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: folderName,
        Body: "",
      })
    );

    res.json({ message: "Usuario registrado" });
  } catch (err) {
    console.log(err);

    // Detectar error de entrada duplicada (correo repetido)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    res.status(500).json({ message: "Error en registro" });
  }
});

// --------------------- LOGIN ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const [rows] = await db.query(
      "SELECT username, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ← SOLO devuelve el username
    res.json({ username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en login" });
  }
});

export default router;
