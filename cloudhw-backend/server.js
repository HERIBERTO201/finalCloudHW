import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.js";
import filesRoutes from "./routes/files.js";
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/files", filesRoutes);
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});
