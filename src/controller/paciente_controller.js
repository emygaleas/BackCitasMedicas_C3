import Paciente from "../models/Paciente.js";
import mongoose from "mongoose";

// CRUD DE Pacientes

// CREAR
const registroPaciente = async (req, res) => {
  try {
    // obtener datos
    const { nombrePaciente, apellidoPaciente, cedulaPaciente, fechaNacimiento, generoPaciente, ciudadPaciente, direccionPaciente, telefonoPaciente, emailPaciente } = req.body; // Desestructuración

    // validar datos
    // campos vacios
    if (Object.values(req.body).includes(" ") || Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    // cédula válida
    const cedulaRegex = /^\d{10}$/; // Solo dígitos, exactamente 10 caracteres
    if (!cedulaRegex.test(cedulaPaciente)) return res.status(400).json({ msg: "Cédula inválida. Debe contener exactamente 10 dígitos." });

    // cédula única
    const verificarCedula = await Paciente.findOne({ cedulaPaciente });
    if (verificarCedula) return res.status(400).json({ msg: "La cédula ya se encuentra registrada." });

    // fecha de nacimiento válida
    if (isNaN(Date.parse(fechaNacimiento))) {
        return res.status(400).json({ msg: "Fecha de nacimiento inválida. Debe tener el formato YYYY-MM-DD." });
    } else if (new Date(fechaNacimiento) > new Date()) {
        return res.status(400).json({ msg: "Fecha de nacimiento inválida. No puede ser una fecha futura." });
    }
    
    // género válido
    const generoMayus = generoPaciente.trim().charAt(0).toUpperCase() + generoPaciente.trim().slice(1).toLowerCase(); //Convertir a mayúscula la primera letra y eliminar espacios
    const generoRegex = /^(Masculino|Femenino|Otro)$/; // Solo "Masculino", "Femenino" u "Otro"
    if (!generoRegex.test(generoMayus)) {
        return res.status(400).json({ msg: "Género inválido. Debe ser 'Masculino', 'Femenino' u 'Otro'." });
    }

    // email en minusculas
    const emailMin = emailPaciente.toLowerCase().trim();

    // formato email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(emailMin)){
        return res.status(400).json({ msg: "Correo electrónico inválido"})
    }

    // verificar email existente
    const verificarEmail = await Paciente.findOne({ emailPaciente: emailMin });
    if (verificarEmail)
        return res
        .status(400)
        .json({ msg: "El email ya se encuentra registrado." });

    // teléfono válido
    const telefonoRegex = /^\d{10}$/; // Solo dígitos, exactamente 10 caracteres
    if (!telefonoRegex.test(telefonoPaciente)) {
        return res.status(400).json({ msg: "Número de teléfono inválido. Debe contener exactamente 10 dígitos." });
    }

    // crear nuevo usuario
    const nuevoPaciente = new Paciente({
        nombrePaciente,
        apellidoPaciente,
        cedulaPaciente,
        fechaNacimiento,
        generoPaciente: generoMayus,
        ciudadPaciente,
        direccionPaciente,
        telefonoPaciente,
        emailPaciente: emailMin
    });

    // guardar usuario
    await nuevoPaciente.save();

    // Respuesta
    res.status(200).json({ msg: "Paciente creado con éxito" });

  } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

// LISTAR
const listarPaciente = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        if (pacientes.length === 0) return res.status(404).json({ msg: "No se encontraron pacientes registrados." });
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// DETALLE PACIENTE
const detallePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de paciente inválido." });
        const paciente = await Paciente.findById(id);
        if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado." });
        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// ACTUALIZAR
const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de paciente inválido." });

        const paciente = await Paciente.findById(id);
        if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado." });

        const { nombrePaciente, apellidoPaciente, cedulaPaciente, fechaNacimiento, generoPaciente, ciudadPaciente, direccionPaciente, telefonoPaciente, emailPaciente } = req.body;

        // lista con datos a actualizar
        const datosActualizar = {};

        // CEDULA
        if (cedulaPaciente){
            // cédula válida
            const cedulaRegex = /^\d{10}$/; // Solo dígitos, exactamente 10 caracteres
            if (!cedulaRegex.test(cedulaPaciente)) return res.status(400).json({ msg: "Cédula inválida. Debe contener exactamente 10 dígitos." });
            // cédula única
            const verificarCedula = await Paciente.findOne({ cedulaPaciente: cedulaPaciente, _id: { $ne: id } }); // Verificar que la cédula no esté registrada en otro paciente
            if (verificarCedula) return res.status(400).json({ msg: "La cédula ya se encuentra registrada." });

            datosActualizar.cedulaPaciente = cedulaPaciente;
        }

        // GENERO
        const generoMayus = generoPaciente ? generoPaciente.trim().charAt(0).toUpperCase() + generoPaciente.trim().slice(1).toLowerCase() : null; //Convertir a mayúscula la primera letra y eliminar espacios
        if (generoPaciente){
            const generoRegex = /^(Masculino|Femenino|Otro)$/; // Solo "Masculino", "Femenino" u "Otro"
            if (!generoRegex.test(generoMayus)) {
                return res.status(400).json({ msg: "Género inválido. Debe ser 'Masculino', 'Femenino' u 'Otro'." });
            }
            datosActualizar.generoPaciente = generoMayus;
        }

        // TELEFONO
        if (telefonoPaciente){
            const telefonoRegex = /^\d{10}$/; // Solo dígitos, exactamente 10 caracteres
            if (!telefonoRegex.test(telefonoPaciente)) {
                return res.status(400).json({ msg: "Número de teléfono inválido. Debe contener exactamente 10 dígitos." });
            }
            datosActualizar.telefonoPaciente = telefonoPaciente;
        }

        // EMAIL
        if (emailPaciente){
            // email en minusculas
            const emailMin = emailPaciente.toLowerCase().trim();
        
            // formato email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(emailMin)){
                return res.status(400).json({ msg: "Correo electrónico inválido"})
            }
        
            // verificar email existente
            const verificarEmail = await Paciente.findOne({ emailPaciente: emailMin, _id: { $ne: id } }); // Verificar que el email no esté registrado en otro paciente
            if (verificarEmail)
                return res
                .status(400)
                .json({ msg: "El email ya se encuentra registrado." });
            
            datosActualizar.emailPaciente = emailMin;
        }

        // Fecha de nacimiento
        if (fechaNacimiento){
            const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
            if (!fechaRegex.test(fechaNacimiento)) {
                return res.status(400).json({ msg: "Fecha de nacimiento inválida. Debe tener el formato YYYY-MM-DD." });
            } else if (new Date(fechaNacimiento) > new Date()) {
                return res.status(400).json({ msg: "Fecha de nacimiento inválida. No puede ser una fecha futura." });
            }
            datosActualizar.fechaNacimiento = fechaNacimiento;
        }

        // Campos simples (sin validaciones especiales)
        if (nombrePaciente) datosActualizar.nombrePaciente = nombrePaciente;
        if (apellidoPaciente) datosActualizar.apellidoPaciente = apellidoPaciente;
        if (ciudadPaciente) datosActualizar.ciudadPaciente = ciudadPaciente;
        if (direccionPaciente) datosActualizar.direccionPaciente = direccionPaciente;

        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, datosActualizar, { returnDocument: 'after' });
        res.status(200).json(pacienteActualizado);
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

// ELIMINAR
const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID de paciente inválido." });

        const paciente = await Paciente.findById(id);
        if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado." });
        await Paciente.findByIdAndDelete(id);
        res.status(200).json({ msg: "Paciente eliminado con éxito." });
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

export { 
    registroPaciente,
    listarPaciente,
    detallePaciente,
    actualizarPaciente,
    eliminarPaciente
}