import jwt from "jsonwebtoken";


const token = jwt.sign({name:"vivek"},"vivek123")
console.log(token);
