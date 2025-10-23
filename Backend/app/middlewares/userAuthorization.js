export const userAuthorization = (role)=>{
	return (req,res,next)=>{
		if(role.includes(req.role)){
			next()
		}else{
			res.json("Not Authorized")
		}
	}
}