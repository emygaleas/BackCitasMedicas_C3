import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
    nombreUsuario:{
        type:String,
        required:true,
        trim:true
    },
    apellidoUsuario:{
        type:String,
        required:true,
        trim:true
    },
    emailUsuario:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    passwordUsuario:{
        type:String,
        required:true,
    },
},{
    timestamps:true // registra fecha de creación y actualización
})

// Método para cifrar la contraseña
usuarioSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

// Método para verificar si el password es el mismo de la BDD
usuarioSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.passwordUsuario)
    return response
}

export default model ('Usuario', usuarioSchema)