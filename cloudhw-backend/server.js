import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importar rutas
import authRoutes from "./routes/auth.js";
import filesRoutes from "./routes/files.js";

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN CORS CORREGIDA ---
app.use(cors({
  origin: [
    "http://localhost:5173",      // Tu frontend en Vite (localhost)
    "http://127.0.0.1:5173",      // Tu frontend (IP local)
    "http://3.19.64.159"          // Tu IP pública de AWS (opcional)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Necesario para cookies o headers de autorización
}));

// NOTA: Se eliminó app.options("*", cors()) porque causa conflicto con credentials: true

// Middleware para entender JSON
app.use(express.json());

// --- RUTAS ---
app.use("/api", authRoutes);
app.use("/files", filesRoutes);

// --- INICIAR SERVIDOR ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
