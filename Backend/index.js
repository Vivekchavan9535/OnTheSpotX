import express from "express"
import configDb from './config/db.js'
import cors from "cors";
const app = express();
import { userCtrl } from './app/controller/user-controller.js'
import {mechCtrl} from './app/controller/mechanic-controller.js'
import {userAuthentication} from './app/middlewares/userAuthentication.js'
import {userAuthorization} from "./app/middlewares/userAuthorization.js";




import dotenv from 'dotenv';
dotenv.config()

const port = process.env.PORT


app.use(cors())
app.use(express.json())

configDb()










//Public Route
app.post('/register', userCtrl.register)
app.post('/login',userCtrl.login)

//protected route
app.get('/users',userAuthentication,userAuthorization(["admin"]),userCtrl.list) 
app.delete('/users/:id',userAuthentication,userAuthorization(["admin"]),userCtrl.remove)

//mechanic
app.post('/mechanic',mechCtrl.create)



app.listen(port, () => {
	console.log(`Server is running on ${port}`)
})