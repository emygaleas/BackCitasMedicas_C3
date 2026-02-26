import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import usuario_routes from "./routes/usuario_routes.js"
const app = express()
dotenv.config()

app.use(cors())
app.set('port',process.env.PORT || 3000)

app.use(express.json())

app.use("/api/usuarios", usuario_routes)

app.get('/',(req,res)=>{res.send("Server on")}) // ruta raíz

export default app