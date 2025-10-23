import jwt from "jsonwebtoken";

export const userAuthentication=async(req,res,next)=>{
	const token = req.headers['authorization'];
	try {
		const tokenData = jwt.verify(token,process.env.SECRET_KEY)
		req.userId = tokenData.userId;
		req.role = tokenData.role;
		next()
	} catch (error) {
		res.status(401).json(error.message)
	}
}