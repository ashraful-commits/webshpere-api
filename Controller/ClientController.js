

/***
GET
GET CLIENT
*/

const expressAsyncHandler = require("express-async-handler")
const { Client } = require("../Model/ClientModel")
const { cloudUploads } = require("../Utils/Cloudinary")

 const getAllClient =expressAsyncHandler(async(req,res)=>{
    try {
       
      
        const client = await Client.find()
        if(client.length<=0){
           return res.status(400).json({message:"No client"})
        }else{
           return res.status(200).json({client:client,message:"All Client"}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})
/***
POST
CREATE CLIENT
*/
 const createClient =expressAsyncHandler(async(req,res)=>{
    try {
        const {clientName,clientEmail,clientPhone,country,state,clientAddress,projects,status,companyName}= req.body
     let avatar
        if(req.file){
           avatar = await cloudUploads(req.file.path)
      }
        const client = await Client.create({clientName,clientEmail,clientPhone,country,state,clientAddress,clientAvatar:avatar?avatar:null,projects:projects?projects:[],status,companyName})
        if(!client){
           return res.status(400).json({message:"No client create"})
        }else{
           return res.status(200).json({client:client,message:"Client create"}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})

module.exports ={
    getAllClient,createClient
}