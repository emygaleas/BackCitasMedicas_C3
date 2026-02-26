import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

const crearTokenJWT = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const verificarTokenJWT = async(req, res, next) =>{
    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({msg: "Acceso denegado: token no proporcionado"})
    
    try{
        const token = authorization.split(" ")[1]

        const {id} = jwt.verify(token, process.env.JWT_SECRET)

        // verificar el usuario
        const usuario = await Usuario.findById(id).select("-passwordUsuario")

        if (!usuario) return res.status(401).json({msg:"Token no válido"})

        req.usuario = usuario
        next()

    }catch (error){
        return res.status(401).json({msg:"Token inválido o expirado"})
    }
}

export{
    crearTokenJWT,
    verificarTokenJWT
}