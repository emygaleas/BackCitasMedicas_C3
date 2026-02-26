import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express()
dotenv.config()

app.use(cors())
app.set('port',process.env.PORT || 3000)

app.use(express.json())

app.get('/',(req,res)=>{res.send("Server on")}) // ruta raíz

export default app