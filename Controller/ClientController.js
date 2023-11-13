

/***
GET
GET CLIENT
*/

const expressAsyncHandler = require("express-async-handler")
const { Client } = require("../Model/ClientModel")
const { Seller } = require("../Model/SellerModel")
const { cloudUploads, cloudDownload, cloudDelete } = require("../Utils/Cloudinary");
const publicIdGenerator = require("../Utils/PublicKeyGeneretor");

const getAllClient = expressAsyncHandler(async (req, res) => {
  try {
    // const { id } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) ||7; 
    // const role = req.query.role ||"user"
    const skip = (page - 1) * limit;
      const client = await Client.find()
      .limit(limit)
      .skip(skip).sort({ timestamp: -1 }).exec();
    
    if (client.length<=0) {
      return res.status(400).json({ message: "No Client" });
    } else {
      return res.status(200).json({ client: client});
    }
    
  } catch (error) {
    console.error(error);
    
  }
});
/***
  DELETE
  DELETE CLIENT
*/
 const deleteClient =expressAsyncHandler(async(req,res)=>{
    try {
      const {id} = req.params
    
        const client = await Client.findByIdAndDelete(id)
        console.log(client)
        if(!client){
           return res.status(400).json({message:"Not client deleted"})
        }else{
          if(client.clientAvatar){
            await cloudDelete(publicIdGenerator(client.clientAvatar))
          }
          if(client.projectFile){
          client.projectFile.forEach(async(element) => {
           await  cloudDelete(publicIdGenerator(element))
          });
          }
          const updateSeller = await Seller.updateMany(
            { $or: [{ client: client?._id }, { projects: client?._id }] },
            {
              $pull: {
                client: client?._id,
                projects: client?._id,
              },
            }
          );
          console.log(updateSeller)
           return res.status(200).json({client:client,message:"client deleted"}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})
/**
 * GET
GET SINGLE CLIENT
 */
 const getSingleClient =expressAsyncHandler(async(req,res)=>{
    try {
      const {id} = req.params
        const client = await Client.findById(id).populate({path:"sellerId",model:Seller})
        if(!client){
           return res.status(400).json({message:"Not client"})
        }else{
           return res.status(200).json({client:client,message:""}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})
/**
  UPDATE
   PUT 
   UPDATE CLIENT
 */
 const updateClient =expressAsyncHandler(async(req,res)=>{
  try {
    const {id} = req.params
    const { clientName,projectSource, sellerId, clientEmail, clientPhone, country, state, clientAddress, companyName, projectName, client, projectType, budget, amount, projectDesc, timeFrame, date, paymentReceived, label, invoices, comments, team, feedBack, commissionRate } = req.body;
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
      const updateFileAndAvatar = await Client.findById(id)
      if(projectFiles.length>0){
          updateFileAndAvatar.projectFile.forEach(async(item)=>{
            await cloudDelete(publicIdGenerator(item))
          })
      }
      if(avatar){
        if(updateFileAndAvatar.clientAvatar)
        await cloudDelete(publicIdGenerator(updateFileAndAvatar.clientAvatar))
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
        await Seller.findByIdAndUpdate(sellerId,{$push:{
          client:clientData?._id,
          projects:clientData?._id
        }}) 
         return res.status(200).json({ client: clientData, message: "Client created & pending" });
       }
     
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
/***
PUT
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
 /**
  * PROJECT STATUS UPDATE
 PUT METHOD
  */
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
const updateCommissionRate = expressAsyncHandler(async (req, res) => {
   try {
     const {id} = req.params
     const {commissionRate} = req.body

 const commissionRateData =await Client.findByIdAndUpdate(id,{commissionRate},{new:true})
       if (!commissionRateData) {
         return res.status(400).json({ message: "Project Commission not updated" });
       } else {

         return res.status(200).json({ client: commissionRateData, message: "Commission status updated" });
       }
     
   } catch (error) {
     console.log(error.message);
     return res.status(500).json({ message: "Internal Server Error" });
   }
 });
const fileDownload = expressAsyncHandler(async (req, res) => {
   try {
    const { url, fileFormat } = req.params;
    const decodedUrl = decodeURIComponent(url);
    const publicId = publicIdGenerator(decodedUrl);
    const downloadUrl =await cloudDownload(publicId, fileFormat);
 
    return res.json({ downloadUrl });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
 });
 

module.exports ={
    getAllClient,createClient,deleteClient,updateClient,PermissionUpdated,projectStatusUpdate,getSingleClient,updateCommissionRate,fileDownload
}