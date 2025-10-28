import mongoose from 'mongoose'


 export default async function configDb(){
	try {
		await mongoose.connect("mongodb+srv://vivekchavan942_db_user:6CtSpRORNdgTz3HE@onthespotx.fbtmb0x.mongodb.net/?appName=OnTheSpotX")
		console.log('Db is connected');
		
	} catch (error) {
		console.log(error.message);
	}
 }

