import mongoose from 'mongoose'


 export default async function configDb(){
	try {
		await mongoose.connect(process.env.DB_URL)
		console.log('Db is connected');
		
	} catch (error) {
		console.log(error.message);
	}
 }

