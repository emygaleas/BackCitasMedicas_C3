import { registro, login, perfil } from "../controller/usuario_controller.js";
import { Router } from "express";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const route = Router()

route.use("/registro", registro)

route.use("/login", login)
route.use("/perfil", verificarTokenJWT, perfil)

export default route;