const expressAsyncHandler = require("express-async-handler")
const { Seller } = require("../Model/SellerModel")
const { cloudUploads, cloudDelete } = require("../Utils/Cloudinary")
const {makeHash} = require("../Utils/CreateHashPassword")
const {comparePasswords} = require("../Utils/PassWordCompare")
const {makeToken} = require("../Utils/CreateToken")
const publicIdGenerator = require("../Utils/PublicKeyGeneretor")

 const getAllSeller =expressAsyncHandler(async(req,res)=>{
try {

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) ||7; 
  const role = req.query.role ||"user"
  const skip = (page - 1) * limit;

  if(role==="admin"){
    const seller = await Seller.find().sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip);

    if(seller.length<=0){
        return res.status(400).json({message:""})
    }else{
        return res.status(200).json({seller,message:""})

    }
  }else{
    return res.status(400).json({message:""})
  }
  
} catch (error) {
    console.log(error.message)
}
})
/***
GET
GET SINGLE SELLER
*/
 const getSingleSeller =expressAsyncHandler(async(req,res)=>{
try {
const {id} = req.params

const seller = await Seller.findById(id).populate({path:"client",
model:"Client"}).populate({
  path:"projects",
  model:"Client"
}).populate({
  path:"salesPerson",
  model:"Seller",
  populate: [
    {
      path: "client",
      model: "Client"
    },
    {
      path: "projects",
      model: "Project" 
    },
    {
      path: "salesPerson",
      model: "Seller" 
    }
  ]
})
    if(!seller){
        return res.status(400).json({message:"No seller"})
    }else{
        return res.status(200).json({seller})

    }
} catch (error) {
    console.log(error.message)
}
})
/***
GET
GET SELLER
*/
 const updateSellerRole =expressAsyncHandler(async(req,res)=>{
try {
    const {id}=req.params
    const {role}=req.body
    const updateRoleData = await Seller.findByIdAndUpdate(id,{role},{new:true})
    if(!updateRoleData){
        return res.status(400).json({message:"Role Not Updated"})
    }else{
        return res.status(200).json({seller:updateRoleData,message:"Role Updated"})

    }
} catch (error) {
    console.log(error.message)
}
})
/***
DELETE
DELETE SELLER
*/
const deleteSeller = expressAsyncHandler(async (req, res) => {
  try {
    const { id ,sellerId} = req.params;


    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(400).json({ message: "Role Not Updated" });
    }else{
      await cloudDelete(publicIdGenerator(deletedSeller.avatar))
      if (sellerId) {
     await Seller.findByIdAndUpdate(
          sellerId,
          { $pull: { salesPerson: deletedSeller._id } },
          { new: true }
        );

      }
      return res.status(200).json({ seller: deletedSeller, message: "Seller deleted" });
    }

    
  

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/***
PUT METHOD
UPDATE SELLER STATUS
*/
 const updateSellerStatus =expressAsyncHandler(async(req,res)=>{
try {
    const {id}=req.params
    const {status}=req.body
  
    const updateRoleData = await Seller.findByIdAndUpdate(id,{status},{new:true})
    if(!updateRoleData){
        return res.status(400).json({message:"Status Not Updated"})
    }else{
        return res.status(200).json({seller:updateRoleData,message:"Status Updated"})

    }
} catch (error) {
    console.log(error.message)
}
})
/***
PUT METHOD
UPDATE SELLER STATUS
*/
 const updateSeller =expressAsyncHandler(async(req,res)=>{
  try {
    const {id} = req.params
    const {name,email,employment,website} = req.body
  
    let companyPhoto ;
    if (req.files && req.files['companyAvatar'] && req.files['companyAvatar'][0]) {
      companyPhoto = await cloudUploads(req.files['companyAvatar'][0].path);
    }
    let sellerAvatar;
    if (req.files && req.files['sellerAvatar'] && req.files['sellerAvatar'][0]) {
     sellerAvatar = await cloudUploads(req.files['sellerAvatar'][0].path);
   }
    const updateFile = await Seller.findById(id)
    if(req.file){
      await cloudDelete(publicIdGenerator(updateFile.avatar))
    }
    const seller = await Seller.findByIdAndUpdate(id,{name,email,employment,website , avatar:sellerAvatar,companyAvatar:companyPhoto},{new:true})
    if(!seller){
        return res.status(404).json({message:"Seller not Update"})
    }else{
      
        return res.status(200).json({seller:seller,message:"Update Seller"})

    }
  
} catch (error) {
    console.log(error.message)
}
})
/***
POST
CREATE SELLER
*/
 const createSeller =expressAsyncHandler(async(req,res)=>{
try {
    const {name,email,password,pricing,client,companyName,salesPerson,sellerId,employment,totalWithdrawn,emailSignature,website,projects} = req.body
   
    const isEmailExist = await Seller.findOne({email})
    if(isEmailExist){
      return res.status(404).json({message:"Email already exist"})
    }else{
      let companyPhoto ;
      if (req.files && req.files['companyAvatar'] && req.files['companyAvatar'][0]) {
        companyPhoto = await cloudUploads(req.files['companyAvatar'][0].path);
      }
      let sellerAvatar;
      if (req.files && req.files['sellerAvatar'] && req.files['sellerAvatar'][0]) {
       sellerAvatar = await cloudUploads(req.files['sellerAvatar'][0].path);
     }
    const seller = await Seller.create({name,companyName,email,password:await makeHash(password),pricing,client:client?client:[],salesPerson:salesPerson?salesPerson:[],employment,totalWithdrawn,emailSignature,website,projects:projects?projects:[] , avatar:sellerAvatar?sellerAvatar:null,companyAvatar:companyPhoto?companyPhoto:null})
    if(!seller){
        return res.status(404).json({message:"Seller not create"})
    }else{
      await Seller.findByIdAndUpdate(
        sellerId,
        {
          $push: {
            salesPerson: seller?._id // Assuming seller is an object with an _id property
          }
        },
        { new: true } // To return the updated document
      );
      
        return res.status(200).json({seller:seller,message:"Seller created & pending"})

    }
  }
} catch (error) {
    console.log(error.message)
}
})
/***
POST
LOGIN SELLER
*/
 const sellerLogin =expressAsyncHandler(async(req,res)=>{
try {
    const {email,password} = req.body
    const IsExistSeller = await Seller.findOne({email})
    if(!IsExistSeller){
        return res.status(400).json({message:"Seller not exist !"})
    }else{
        const compare =await comparePasswords(password,IsExistSeller.password)
        if(!compare){
            return res.status(400).json({message:"Password not Match !"})
        }else{
            const Token =await makeToken(
                {
                  email: IsExistSeller.email,
                  password: IsExistSeller.password,
                },
                process.env.JWT_SECRECT,
                "7d"
              );
            const RefToken =await makeToken(
                {
                  email: IsExistSeller.email,
                  password: IsExistSeller.password,
                },
                process.env.REF_JWT_SECRECT,
                "30d"
              );
              res
                .cookie("accessToken", Token, {
                  httpOnly: true,
                  secure: process.env.APP_ENV === "development" ? false : true,
                  sameSite:"strict",
                  domain: 'wordsphere.vercel.app', 
                  path: '/',
                  maxAge: 1000 * 60 * 60 * 24 * 7,
                })
                .status(200)
                .json({
                  token: Token,
                  refToken: RefToken,
                  message: "Entered into dashboard!",
                  seller: IsExistSeller,
                });
        }
    }
} catch (error) {
    console.log(error)
}
})
/***
GET
LOGIN SELLER
*/
 const me =expressAsyncHandler(async(req,res)=>{
  try {
    if(!req.me){
     return res.status(400).json({message:"Login please !"})
    }else{
    return res.status(200).json({seller:req.me,message:""})
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports ={
  createSeller,sellerLogin,getAllSeller,me
}
/***
GET
LOGIN OUT
*/
 const LogoutSeller =expressAsyncHandler(async(req,res)=>{
  try {
    res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite:"strict",
    })
    .json({ message: "Logout success!" });
  } catch (error) {
    console.log(error)
  }
})

module.exports ={
  createSeller,sellerLogin,getAllSeller,me,LogoutSeller,updateSellerRole,getSingleSeller,updateSellerStatus,deleteSeller,updateSeller
}