import { Schema, model } from "mongoose";

const pacienteSchema = new Schema({
    nombrePaciente:{
        type:String,
        required:true,
        trim:true
    },
    apellidoPaciente:{
        type:String,
        required:true,
        trim:true
    },
    cedulaPaciente:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    fechaNacimiento:{
        type:Date,
        required:true,
    },
    generoPaciente:{
        type:String,
        required:true,
        enum:['Masculino', 'Femenino', 'Otro'],
        trim:true
    },
    ciudadPaciente:{
        type:String,
        required:true,
        trim:true
    },
    direccionPaciente:{
        type:String,
        required:true,
        trim:true
    },
    telefonoPaciente:{
        type:String,
        required:true,
        trim:true
    },
    emailPaciente:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{
    timestamps:true // registra fecha de creación y actualización
})

export default model ('Paciente', pacienteSchema)