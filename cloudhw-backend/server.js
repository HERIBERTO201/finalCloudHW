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
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://3.19.64.159"
    ];
    // Permitir peticiones sin origin (como Postman o Curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS no permitido"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
