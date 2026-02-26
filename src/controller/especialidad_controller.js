import Especialidad from "../models/Especialidad.js";
import mongoose from "mongoose";

// CRUD DE ESPECIALIDADES

// CREAR
const registroEspecialidad = async (req, res) => {
    try {
        const {codigoEspecialidad, nombreEspecialidad, descripcionEspecialidad} = req.body;
        if (Object.values(req.body).includes(" ") || Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

        // validar que el codigo de la especialidad no contenga espacios, maximo 20 caracteres y sea alfanumérico
        if (/\s/.test(codigoEspecialidad) || codigoEspecialidad.length > 20 || !/^[a-zA-Z0-9]+$/.test(codigoEspecialidad)) {
            return res.status(400).json({ msg: "El código de la especialidad no debe contener espacios, debe tener máximo 20 caracteres y ser alfanumérico." });
        }
        
        // validar que el código de la especialidad sea único
        const especialidadExistente = await Especialidad.findOne({ codigoEspecialidad });
        if (especialidadExistente) {
            return res.status(400).json({ msg: "El código de la especialidad ya existe. Por favor, elige otro código." });
        }
        
        const nuevaEspecialidad = new Especialidad({
            nombreEspecialidad,
            codigoEspecialidad,
            descripcionEspecialidad
        });
        
        await nuevaEspecialidad.save();
        res.status(201).json({msg:"Especialidad registrada con éxito."});
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// LISTAR
const listarEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.find();
        if (especialidades.length === 0) return res.status(404).json({ msg: "No se encontraron especialidades." });
        res.status(200).json(especialidades);
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// DETALLE ESPECIALIDAD
const detalleEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de especialidad inválido." });
        const especialidad = await Especialidad.findById(id);
        if (!especialidad) return res.status(404).json({ msg: "Especialidad no encontrada." });
        res.status(200).json(especialidad);
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// ACTUALIZAR
const actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de especialidad inválido." });
        
        const especialidad = await Especialidad.findById(id);
        if (!especialidad) return res.status(404).json({ msg: "Especialidad no encontrada." });

        const { nombreEspecialidad, codigoEspecialidad, descripcionEspecialidad } = req.body;

        if (Object.values(req.body).includes(" ") || Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        
        const datosActualizar = {};

        if (nombreEspecialidad) {
            const nombreExistente = nombreEspecialidad.trim().toLowerCase();
            const especialidades = await Especialidad.find({ _id: { $ne: id } }); // Obtener todas las especialidades excepto la que se está actualizando

            if (nombreExistente in especialidades.map(e => e.nombreEspecialidad.trim().toLowerCase())) {
                return res.status(400).json({ msg: "El nombre de la especialidad ya existe. Por favor, elige otro nombre." });
            }
            datosActualizar.nombreEspecialidad = nombreEspecialidad;
        }

        if (codigoEspecialidad) {
            const especialidadExistente = await Especialidad.findOne({ codigoEspecialidad: codigoEspecialidad.trim(), _id: { $ne: id } }); // Verificar si el código ya existe en otra especialidad
            if (especialidadExistente) {
                return res.status(400).json({ msg: "El código de la especialidad ya existe. Por favor, elige otro código." });
            } else if (/\s/.test(codigoEspecialidad) || codigoEspecialidad.length > 20 || !/^[a-zA-Z0-9]+$/.test(codigoEspecialidad)) {
                return res.status(400).json({ msg: "El código de la especialidad no debe contener espacios, debe tener máximo 20 caracteres y ser alfanumérico." });
            }
            datosActualizar.codigoEspecialidad = codigoEspecialidad;
        }

        if (descripcionEspecialidad) datosActualizar.descripcionEspecialidad = descripcionEspecialidad;

        const especialidadActualizada = await Especialidad.findByIdAndUpdate(id, datosActualizar, { returnDocument: "after" });
        res.status(200).json({msg:"Especialidad actualizada con éxito", especialidadActualizada});
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// ELIMINAR
const eliminarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de especialidad inválido." });
        const especialidad = await Especialidad.findById(id);
        if (!especialidad) return res.status(404).json({ msg: "Especialidad no encontrada." });
        await Especialidad.findByIdAndDelete(id);
        res.status(200).json({ msg: "Especialidad eliminada con éxito." });
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

export {
    registroEspecialidad,
    listarEspecialidades,
    detalleEspecialidad,
    actualizarEspecialidad,
    eliminarEspecialidad
}