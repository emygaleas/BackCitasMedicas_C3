import Paciente from "../models/Paciente.js";
import Especialidad from "../models/Especialidad.js";
import mongoose from "mongoose";
import Cita from "../models/Cita.js";

const registroCita = async (req, res) => {
    try {
        // obtener datos
        const { codigoCita, descripcionCita, paciente, especialidad} = req.body;

        // validar datos
        // campos vacíos
        if (Object.values(req.body).includes(" ") || Object.values(req.body).includes(""))
            return res.status(400).json({ msg: "Debes llenar todos los campos." });

        // validar paciente en la base de datos
        if (!mongoose.Types.ObjectId.isValid(paciente))
            return res.status(400).json({ msg: "Paciente inválido." });
    
        const pacienteExiste = await Paciente.findById(paciente);
        if (!pacienteExiste)
            return res.status(404).json({ msg: "El paciente no existe." });

        // validar especialidad en la base de datos
        if (!mongoose.Types.ObjectId.isValid(especialidad)) return res.status(400).json({ msg: "Especialidad inválida." });
    
        const especialidadExiste = await Especialidad.findById(especialidad);
        if (!especialidadExiste) return res.status(404).json({ msg: "La especialidad no existe." });
    
        // validar código único
        const codigoExiste = await Cita.findOne({ codigoCita });
        if (codigoExiste) return res.status(400).json({ msg: "El código de la cita ya existe." });

        // Crear nueva cita
        const nuevaCita = await Cita.create({
            codigoCita,
            descripcionCita,
            paciente,
            especialidad
        });

        // Respuesta exitosa
        res.status(201).json({ msg: "✅ Cita registrada con éxito.", cita: nuevaCita });

    } catch (error) {
      res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

// LISTAR CITAS
const listarCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
        .select('codigoCita descripcionCita paciente especialidad') // Solo traer campos necesarios
        .populate('paciente', 'nombrePaciente apellidoPaciente emailPaciente') // Solo traer nombre, apellido y correo del paciente
        .populate('especialidad', 'nombreEspecialidad descripcionEspecialidad'); // Solo traer nombre y descripción de la especialidad
    if (citas.length === 0) {
        return res.status(404).json({ msg: "No hay citas registradas." });
    }
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

// DETALLE CITA
const detalleCita = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "ID de cita inválido." });
    const cita = await Cita.findById(id)
        .populate('paciente', 'nombrePaciente apellidoPaciente emailPaciente') // Solo traer nombre, apellido y correo del paciente
        .populate('especialidad', 'nombreEspecialidad descripcionEspecialidad'); // Solo traer nombre y descripción de la especialidad

    if (!cita) {
        return res.status(404).json({ msg: "Cita no encontrada." });
    }

    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

// ACTUALIZAR CITA
const actualizarCita = async (req, res) => {
    try{
        // obtener datos
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de cita inválido." });

        const cita = await Cita.findById(id);
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada." });

        // actualizar datos de la cita
        const { paciente, especialidad, codigoCita, descripcionCita } = req.body;

        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos." });

        const datosActualizar = {};

        if (paciente){
            // validar paciente en la base de datos
            const pacienteExiste = await Paciente.findById(paciente);
            if (!pacienteExiste) return res.status(404).json({ msg: "El paciente no existe." });

            datosActualizar.paciente = paciente;
        }

        if (especialidad){
            // validar especialidad en la base de datos
            const especialidadExiste = await Especialidad.findById(especialidad);
            if (!especialidadExiste) return res.status(404).json({ msg: "La especialidad no existe." });

            datosActualizar.especialidad = especialidad;
        }

        if (descripcionCita) datosActualizar.descripcionCita = descripcionCita;

        // validar código único (excluyendo el codigo actual)
        if (codigoCita) {
            const codigoExiste = await Cita.findOne({ codigoCita, _id: { $ne: id } });
            if (codigoExiste) return res.status(400).json({ msg: "El código de la cita ya existe." });
            datosActualizar.codigoCita = codigoCita;
        }

        if (descripcionCita) datosActualizar.descripcionCita = descripcionCita;

        // Actualizar cita
        const citaActualizada = await Cita.findByIdAndUpdate(id, datosActualizar, { returnDocument: "after" });

        res.status(200).json({ msg: "✅ Cita actualizada con éxito.", cita: citaActualizada });
    }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}

const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de cita inválido." });
        const cita = await Cita.findById(id);
        if (!cita) return res.status(404).json({ msg: "Cita no encontrada." });
        await Cita.findByIdAndDelete(id);
        res.status(200).json({ msg: "Cita eliminada con éxito." });
    }catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
};

export { 
    registroCita,
    listarCitas,
    detalleCita,
    actualizarCita,
    eliminarCita
};