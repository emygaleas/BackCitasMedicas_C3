import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";
import { crearTokenJWT } from "../middlewares/JWT.js";

const registro = async (req, res) => {
  try {
    // obtener datos
    const { nombreUsuario, apellidoUsuario, emailUsuario, passwordUsuario } = req.body; // Desestructuración

    // validar datos
    // campos vacios
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    // email en minusculas
    const emailMin = emailUsuario.toLowerCase().trim();

    // formato email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(emailMin)){
        return res.status(400).json({ msg: "Correo electrónico inválido"})
    }

    // verificar email existente
    const verificarEmail = await Usuario.findOne({ emailUsuario: emailMin });
    if (verificarEmail)
        return res
        .status(400)
        .json({ msg: "El email ya se encuentra registrado." });

    // verificar largo contraseña
    if (passwordUsuario.length < 5){
        return res.status(400).json({msg: "La contraseña debe ser mínimo de 5 caracteres"})
    }

    // crear nuevo usuario
    const nuevoUsuario = new Usuario({
        nombreUsuario,
        apellidoUsuario,
        emailUsuario: emailMin,
        passwordUsuario
    });

    // encriptar contraseña
    nuevoUsuario.passwordUsuario = await nuevoUsuario.encryptPassword(passwordUsuario);

    // guardar usuario
    await nuevoUsuario.save();

    // Respuesta
    res.status(200).json({ msg: "Usuario creado con éxito" });

  } catch (error) {
    res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const login = async (req, res) => {
    try {
        const { emailUsuario, passwordUsuario } = req.body;

        // Validar campos vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        
        // email en minusculas
        const emailMin = emailUsuario.toLowerCase().trim();

        // formato email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(emailMin)){
            return res.status(400).json({ msg: "Correo electrónico inválido"})
        }

        // Verificar si el usuario existe
        const usuarioBDD = await Usuario.findOne({ emailUsuario: emailMin });

        if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no encontrado" });

        // Verificar contraseña
        const verificarPassword = await usuarioBDD.matchPassword(passwordUsuario);

        if (!verificarPassword) return res.status(401).json({ msg: "Contraseña incorrecta" });

        // Crear token
        const token = crearTokenJWT(usuarioBDD._id.toString());

        // Respuesta
        res.status(200).json({token, usuario: {id: usuarioBDD._id, nombre: usuarioBDD.nombreUsuario, apellido: usuarioBDD.apellidoUsuario, email: usuarioBDD.emailUsuario}});

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

const perfil = async (req, res) => {
    try {
        // req.usuario contiene la info del usuario autenticado

        // Respuesta
        res.status(200).json(req.usuario);

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
};

export { registro, login, perfil };