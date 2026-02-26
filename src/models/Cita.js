import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import Paciente from "./Paciente.js";
import Especialidad from "./Especialidad.js";

const citaSchema = new Schema({
    codigoCita:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    descripcionCita:{
        type:String,
        required:true,
        trim:true
    },
    paciente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required:true
    },
    especialidad:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidad',
        required:true
    }
})

export default model ('Cita', citaSchema)