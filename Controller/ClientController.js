

/***
GET
GET CLIENT
*/

const expressAsyncHandler = require("express-async-handler")
const { Client } = require("../Model/ClientModel")
const { Seller } = require("../Model/SellerModel")
const { cloudUploads } = require("../Utils/Cloudinary")
const { Project } = require("../Model/ProjectModel")

const getAllClient = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) ||7; 

    const skip = (page - 1) * limit;

    const client = await Client.find({ sellerId: id })
      .limit(limit)
      .skip(skip);

    if (client.length <= 0) {
      return res.status(400).json({ message: "No client" });
    } else {
      return res.status(200).json({ client: client, message: "" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
 const deleteClient =expressAsyncHandler(async(req,res)=>{
    try {
      const {id} = req.params
        const client = await Client.findByIdAndDelete(id)
        if(!client){
           return res.status(400).json({message:"Not client deleted"})
        }else{
           return res.status(200).json({client:client,message:"client deleted"}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})
 const getSingleClient =expressAsyncHandler(async(req,res)=>{
    try {
      const {id} = req.params
        const client = await Client.findById(id).populate({path:"sellerId",model:Seller})
        if(!client){
           return res.status(400).json({message:"Not client"})
        }else{
           return res.status(200).json({client:client,message:" "}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})
 const updateClient =expressAsyncHandler(async(req,res)=>{
  try {
    const {id} = req.params
    const { clientName,projectSource, sellerId, clientEmail, clientPhone, country, state, clientAddress, companyName, projectName, client, projectType, budget, amount, projectDesc, timeFrame, date, paymentReceived, label, invoices, comments, team, feedBack, commissionRate } = req.body;
console.log(req.body)
console.log(id)
      const projectFiles = []

      if (req.files && Array.isArray(req.files['projectFile'])) {
        for (let i = 0; i < req.files['projectFile'].length; i++) {
          const fileUrl = await cloudUploads(req.files['projectFile'][i].path);
          projectFiles.push(fileUrl);
        }
      }
      let avatar;

      if (req.files && Array.isArray(req.files['clientAvatar']) && req.files['clientAvatar'][0]) {
        avatar = await cloudUploads(req.files['clientAvatar'][0].path);
      }

   const updatedData = await Client.findByIdAndUpdate(id,{
    clientName,
         clientEmail,
         clientPhone,
         country,
         state,   
         clientAddress,
         clientAvatar: avatar&&avatar,
         companyName,
         projectName,
         client,
         projectType,
         budget,
         amount,
         projectDesc,
         timeFrame,
         projectFile: projectFiles&&projectFiles,
         date,
         paymentReceived,
         label,
         projectSource,
         invoices,
         comments,
         team,
         feedBack,
         commissionRate,
         projectStatus:"pending",
         sellerId
   },{new:true})

   if(!updatedData){
    return res.status(404).json({ client: updatedData, message: "Not Updated!" });
   }else{
    return res.status(200).json({ client: updatedData, message: "Client Updated!" });
   } 
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
})
/***
POST
CREATE CLIENT
*/
const createClient = expressAsyncHandler(async (req, res) => {
   try {
     const { clientName,projectSource, sellerId, clientEmail, clientPhone, country, state, clientAddress, companyName, projectName,projectType, budget, amount, projectDesc, timeFrame, date, paymentReceived, label, invoices, comments, team, feedBack, commissionRate,  } = req.body;
     let projectFiles =[]
        if(req.files['projectFile']){
         if(req.files['projectFile']){
           for(let i =0; i<req.files['projectFile'].length; i++){
             const fileUrl = await cloudUploads(req.files['projectFile'][i].path)
             projectFiles.push(fileUrl)
           }
         }
        }
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
         companyName,
         projectName,
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
         projectStatus:"pending",
         sellerId
       });
 
       if (!clientData) {
         return res.status(400).json({ message: "No client created" });
       } else {

         return res.status(200).json({ client: clientData, message: "Client created" });
       }
     
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
/***
POST
CREATE CLIENT
*/
const PermissionUpdated = expressAsyncHandler(async (req, res) => {
   try {
     const {id} = req.params
     const {status} = req.body
 const permission =await Client.findByIdAndUpdate(id,{status},{new:true})
       if (!permission) {
         return res.status(400).json({ message: "Permission not updated!" });
       } else {

         return res.status(200).json({ client: permission, message: "permission updated" });
       }
     
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
const projectStatusUpdate = expressAsyncHandler(async (req, res) => {
   try {
     const {id} = req.params
     const {projectStatus} = req.body

 const projectStatusData =await Client.findByIdAndUpdate(id,{projectStatus},{new:true})
       if (!projectStatusData) {
         return res.status(400).json({ message: "Project status not updated" });
       } else {

         return res.status(200).json({ client: projectStatusData, message: "Project status updated" });
       }
     
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
 

module.exports ={
    getAllClient,createClient,deleteClient,updateClient,PermissionUpdated,projectStatusUpdate,getSingleClient
}