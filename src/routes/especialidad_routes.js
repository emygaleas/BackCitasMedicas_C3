import { Router } from "express";
import { registroEspecialidad, listarEspecialidades, detalleEspecialidad, eliminarEspecialidad, actualizarEspecialidad } from "../controller/especialidad_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router()

// Ruta para registrar especialidades
router.post("/registro", verificarTokenJWT, registroEspecialidad)

// Ruta para listar especialidades
router.get("/listar", verificarTokenJWT, listarEspecialidades)

// Ruta para obtener detalle de especialidad
router.get("/detalle/:id", verificarTokenJWT, detalleEspecialidad)

// Ruta para actualizar especialidad
router.put("/actualizar/:id", verificarTokenJWT, actualizarEspecialidad)

// Ruta para eliminar especialidad
router.delete("/eliminar/:id", verificarTokenJWT, eliminarEspecialidad)

export default router