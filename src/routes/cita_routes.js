import { Router } from "express";
import { registroCita, listarCitas, detalleCita, actualizarCita, eliminarCita } from "../controller/cita_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

// Rutas para citas
router.post('/registro', verificarTokenJWT, registroCita);

// Ruta para listar citas
router.get('/listar', verificarTokenJWT, listarCitas);

// Ruta para detalle de cita
router.get('/detalle/:id', verificarTokenJWT, detalleCita);

// Ruta para actualizar cita
router.put('/actualizar/:id', verificarTokenJWT, actualizarCita);

// Ruta para eliminar cita
router.delete('/eliminar/:id', verificarTokenJWT, eliminarCita);

export default router;