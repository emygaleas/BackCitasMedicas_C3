import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import usuario_routes from "./routes/usuario_routes.js"
import paciente_routes from "./routes/paciente_routes.js"
import especialidad_routes from "./routes/especialidad_routes.js"
import cita_routes from "./routes/cita_routes.js"

const app = express()
dotenv.config()

app.use(cors())
app.set('port',process.env.PORT || 3000)

app.use(express.json())

app.use("/api/usuarios", usuario_routes)
app.use("/api/pacientes", paciente_routes)
app.use("/api/especialidades", especialidad_routes)
app.use("/api/citas", cita_routes)

app.get('/',(req,res)=>{res.send("Server on")}) // ruta raíz

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app