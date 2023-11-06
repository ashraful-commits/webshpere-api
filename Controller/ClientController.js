

/***
GET
GET CLIENT
*/

const expressAsyncHandler = require("express-async-handler")
const { Client } = require("../Model/ClientModel")
const { Seller } = require("../Model/SellerModel")
const { cloudUploads } = require("../Utils/Cloudinary")
const { Project } = require("../Model/ProjectModel")

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
const createClient = expressAsyncHandler(async (req, res) => {
   try {
     const { clientName,projectSource, sellerId, clientEmail, clientPhone, country, state, clientAddress, status, companyName, projectName, client, projectType, budget, amount, projectDesc, timeFrame, date, paymentReceived, label, invoices, comments, team, feedBack, commissionRate, projectStatus } = req.body;
     let projectFiles =[]
        if(req.files['projectFile']){
         if(req.files['projectFile']){
           for(let i =0; i<req.files['projectFile'].length; i++){
             const fileUrl = await cloudUploads(req.files['projectFile'][i].path)
             projectFiles.push(fileUrl)
           }
         }
        }
     const project = await Project.create({
       projectName,
       client,
       projectType,
       budget,
       amount,
       projectDesc,
       timeFrame,
       projectFile: projectFiles? projectFiles : null,
       date,
       paymentReceived,
       label,
       projectSource,
       invoices,
       comments,
       team,
       feedBack,
       commissionRate,
       projectStatus:"pending"
     });

     if (!project) {
       return res.status(400).json({ message: "No project created" });
     } else {
       // Prepare projects array for the Client
       const projectsArray = project ? [project._id] : [];
 
       // Logic for avatar assignment
       let avatar;
       if (req.files && req.files['clientAvatar'] && req.files['clientAvatar'][0]) {
        avatar = await cloudUploads(req.files['clientAvatar'][0].path);
      }
    
       const clientData = await Client.create({
         clientName,
         clientEmail,
         clientPhone,
         country,
         state,   
         clientAddress,
         clientAvatar: avatar ? avatar : null,
         projects: projectsArray,
         status,
         companyName
       });
 
       if (!clientData) {
         return res.status(400).json({ message: "No client created" });
       } else {
         // Update the associations in Project and Seller models
         await Project.findByIdAndUpdate(project._id, { $push: { client: clientData._id } });
         await Seller.findByIdAndUpdate(sellerId, { $push: { client: clientData._id } });
         return res.status(200).json({ client: clientData, message: "Client created" });
       }
     }
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
 

module.exports ={
    getAllClient,createClient
}