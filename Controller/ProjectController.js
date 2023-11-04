


/***
GET
GET ALL PROJECTS
*/

const expressAsyncHandler = require("express-async-handler")

const { cloudUploads } = require("../Utils/Cloudinary")
const Project = require("../Model/ProjectModel")

 const getAllProjects =expressAsyncHandler(async(req,res)=>{
    try {
      
        const project = await Project.find()
        if(project.length<=0){
           return res.status(400).json({message:"No project "})
        }else{
           return res.status(200).json({project:project,message:"All Projects"}) 
        }
    } catch (error) {
        console.log(error.message)
    }
})


/***
POST
CREATE PROJECTS
*/

 const createProject =expressAsyncHandler(async(req,res)=>{
    try {
        const {projectName,client,projectType,budget,amount,projectDesc,timeFrame,date,paymentReceived,label,invoices,comments,team,feedBack,commissionRate,projectStatus }= req.body
      
        let projectFiles =[]
       if(req.files){
        if(req.files){
          for(let i =0; i<req.files.length; i++){
            const fileUrl = await cloudUploads(req.files[i].path)
            projectFiles.push(fileUrl)
          }
        }
       }
      
        const project = await Project.create({projectName,client,projectType,budget,amount,projectDesc,timeFrame,projectFile:projectFiles?projectFiles:null,date,paymentReceived,label,invoices,comments,team,feedBack,commissionRate,projectStatus})
        if(!project){
           return res.status(400).json({message:"No project create"})
        }else{
           return res.status(200).json({project:project,message:"Project create"}) 
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports ={
    createProject,getAllProjects
}