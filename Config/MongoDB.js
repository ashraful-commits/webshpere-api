const mongoose =require("mongoose")

 const MongoDBConnection =()=>{
 try {
  const connection = mongoose.connect(process.env.MONGO_URL)
    console.log(`Mongodb connected successfully!`.bgMagenta)
 } catch (error) {
    console.log(error.message)
 }
}

module.exports={MongoDBConnection}