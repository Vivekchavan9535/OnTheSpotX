import express from "express"
import configDb from './config/db.js'
import cors from "cors";
const app = express();
import { userCtrl } from './app/controller/user-controller.js'
import {mechCtrl} from './app/controller/mechanic-controller.js'
import serviceCtrl from './app/controller/service-controller.js'
import serviceReqCtrl from './app/controller/serviceRequest-controller.js'
import {userAuthentication} from './app/middlewares/userAuthentication.js'
import {userAuthorization} from "./app/middlewares/userAuthorization.js";
import webhookCtrl from './app/controller/webhook-controller.js'




import dotenv from 'dotenv';
dotenv.config()

const port = process.env.PORT


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

configDb()



//Public Route
app.post('/register', userCtrl.register)
app.post('/login',userCtrl.login)

//protected route
app.get('/users',userAuthentication,userAuthorization(["admin"]),userCtrl.list) 
app.get('/user/account',userAuthentication, userCtrl.account);
app.delete('/users/:id',userAuthentication,userAuthorization(["admin"]),userCtrl.remove)
app.get('/user/:id', userAuthentication,userAuthorization(["admin"]),userCtrl.show)

//mechanic
app.post('/register/mechanic',userAuthentication,userAuthorization(["mechanic"]),mechCtrl.create)
app.get('/mechanics',userAuthentication,userAuthorization(['admin']),mechCtrl.list)
app.get('/mechanic/:id',userAuthentication,userAuthorization(['mechanic']),mechCtrl.show)
app.put('/mechanic/update/:id',userAuthentication,userAuthorization(["mechanic"]),mechCtrl.update)
app.delete('/mechanic/:id',userAuthentication,userAuthorization(["mechanic"]),mechCtrl.delete)

//service
app.post('/service',userAuthentication,userAuthorization(['admin']),serviceCtrl.create)
app.get('/services',userAuthentication,userAuthorization(['admin']),serviceCtrl.list)
app.get('/service/:id',userAuthentication,userAuthorization(['admin']),serviceCtrl.show)
app.put('/service/:id',userAuthentication,userAuthorization(['admin']),serviceCtrl.update)
app.delete('/service/:id',userAuthentication,userAuthorization(['admin']),serviceCtrl.remove)

//service request
app.post('/service-request',userAuthentication,userAuthorization(['customer']),serviceReqCtrl.create)



//whatsapp msg response from nearest mechanic 1 - accept, 2-reject
app.post('/whatsapp',webhookCtrl.handleWhatsapp)
app.post("/reset", webhookCtrl.resetAllRequests);

app.listen(port, () => {
	console.log(`Server is running on ${port}`)
})
