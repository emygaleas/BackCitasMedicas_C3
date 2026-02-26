import { Schema, model } from "mongoose";

const especialidadSchema = new Schema({
    codigoEspecialidad:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    nombreEspecialidad:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    descripcionEspecialidad:{
        type:String,
        required:true,
        trim:true
    }
})

export default model ('Especialidad', especialidadSchema)