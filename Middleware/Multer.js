const multer =require("multer")

const Storages = multer.diskStorage({
    filename:(req,file,cb)=>{
      cb(null,Date.now()+ Math.round(Math.random()*10000)+ "-" + file.fieldname)
  
    },
  
  })
   const clientAvatar = multer({
    storage:Storages
  }).single("clientAvatar")
   const sellerAvatar = multer({
    storage:Storages
  }).single("sellerAvatar")
   const projectFiles = multer({
    storage:Storages
  }).array("projectFile",5)

  module.exports ={
    clientAvatar,sellerAvatar,projectFiles
  }