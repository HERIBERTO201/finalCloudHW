import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importar rutas
import authRoutes from "./routes/auth.js";
import filesRoutes from "./routes/files.js";
import coursesRoutes from "./routes/courses.js";
import homeworkRoutes from "./routes/hw.js";
import eventsRoutes from "./routes/events.js";

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =========================
// 🔥 CONFIGURACIÓN CORS PRO
// =========================

// Lista de orígenes permitidos
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://3.19.64.159"  // tu frontend en AWS
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      // Permitir si coincide con la lista
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Origen bloqueado por CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],

    // 🔥 Impide que Express responda 204 automáticamente
    optionsSuccessStatus: 200,
    preflightContinue: false
  })
);

// 🔥 Manejar preflight OPTIONS correctamente
app.options("*", cors());

// Middleware para aceptar JSON
app.use(express.json());

// ------------------------
// RUTAS
// ------------------------
app.use("/api", authRoutes);
app.use("/files", filesRoutes);
app.use("/courses", coursesRoutes);
app.use("/homework", homeworkRoutes);
app.use("/events", eventsRoutes);

// ------------------------
// INICIAR SERVIDOR
// ------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
