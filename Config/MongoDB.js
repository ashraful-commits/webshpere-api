const mongoose =require("mongoose")
//=================================== mongodb connection 
 const MongoDBConnection =()=>{
 try {
  const connection = mongoose.connect(process.env.MONGO_URL)
    console.log(`Mongodb connected successfully!`.bgMagenta)
 } catch (error) {
    console.log(error.message)
 }
}
//=================================== export 
module.exports={MongoDBConnection}