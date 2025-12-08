import express from "express";
import multer from "multer";
import { ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Multer
const upload = multer({ storage: multer.memoryStorage() });

// Cliente S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// ===============================================
// SUBIR ARCHIVO  --> POST /files/upload
// ===============================================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { username } = req.body;
    const file = req.file;

    if (!file || !username) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const key = `${username}/${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
      })
    );

    return res.json({
      success: true,
      filename: file.originalname
    });

  } catch (err) {
    console.error("Error subiendo archivo:", err);
    return res.status(500).json({ message: "Error subiendo archivo" });
  }
});

// ===============================================
// LISTAR ARCHIVOS  --> GET /files/list/:username
// ===============================================
router.get("/list/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        Prefix: `${username}/`,
      })
    );

    const files = (data.Contents || [])
      .filter(obj => obj.Key !== `${username}/`)
      .map(obj => obj.Key.replace(`${username}/`, ""));

    return res.json({ files });

  } catch (err) {
    console.error("Error listando archivos:", err);
    return res.status(500).json({ message: "Error listando archivos" });
  }
});

// DESCARGAR ARCHIVO
router.get("/download/:username/:filename", async (req, res) => {
  const { username, filename } = req.params;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${username}/${filename}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3.send(command);

    res.setHeader("Content-Type", data.ContentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    data.Body.pipe(res);
    
  } catch (err) {
    console.error("Error descargando archivo:", err);
    res.status(500).json({ error: "No se pudo descargar" });
  }
});


// ELIMINAR ARCHIVO
router.delete("/delete/:username/:filename", async (req, res) => {
  const { username, filename } = req.params;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${username}/${filename}`,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    res.json({ message: "Archivo eliminado" });
  } catch (err) {
    console.error("Error eliminando archivo:", err);
    res.status(500).json({ error: "No se pudo eliminar" });
  }
});

export default router;