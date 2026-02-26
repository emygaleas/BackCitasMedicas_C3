import { Router } from "express";
import { registroPaciente, listarPaciente, actualizarPaciente, detallePaciente, eliminarPaciente } from "../controller/paciente_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router()

// Ruta para registrar pacientes
router.post("/registro", verificarTokenJWT, registroPaciente)

// Ruta para listar pacientes
router.get("/listar", verificarTokenJWT, listarPaciente)

// Ruta para obtener detalle de paciente
router.get("/detalle/:id", verificarTokenJWT, detallePaciente)

// Ruta para actualizar paciente
router.put("/actualizar/:id", verificarTokenJWT, actualizarPaciente)

// Ruta para eliminar paciente
router.delete("/eliminar/:id", verificarTokenJWT, eliminarPaciente)

export default router