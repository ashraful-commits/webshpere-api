const expressAsyncHandler = require("express-async-handler")
const { Seller } = require("../Model/SellerModel")
const { cloudUploads } = require("../Utils/Cloudinary")
const {makeHash} = require("../Utils/CreateHashPassword")
const {comparePasswords} = require("../Utils/PassWordCompare")
const {makeToken} = require("../Utils/CreateToken")
/***
GET
GET SELLER
*/
 const getAllSeller =expressAsyncHandler(async(req,res)=>{
try {

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) ||7; 
  const role = req.query.role === "admin" ? false : true;
  const skip = (page - 1) * limit;
    const seller = await Seller.find({status:role})
    .limit(limit)
    .skip(skip);

    if(seller.length<=0){
        return res.status(400).json({message:""})
    }else{
        return res.status(200).json({seller,message:""})

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
  console.log(id)
const seller = await Seller.findById(id)
    if(!seller){
        return res.status(400).json({message:""})
    }else{
        return res.status(200).json({seller,message:""})

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
POST
CREATE SELLER
*/
 const createSeller =expressAsyncHandler(async(req,res)=>{
try {
    const {name,email,password,pricing,client,salesPerson,sellerId,employment,totalWithdrawn,emailSignature,website,projects} = req.body
    const isEmailExist = await Seller.findOne({email})
    if(isEmailExist){
      return res.status(404).json({message:"Email already exist"})
    }else{
    const sellerAvatar = await cloudUploads(req.file.path)
    const seller = await Seller.create({name,email,password:await makeHash(password),pricing,client:client?client:[],salesPerson:salesPerson?salesPerson:[],employment,totalWithdrawn,emailSignature,website,projects:projects?projects:[] , avatar:sellerAvatar?sellerAvatar:null})
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
      
        return res.status(200).json({seller:seller,message:"Seller created"})

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
                  path:"/",
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
  createSeller,sellerLogin,getAllSeller,me,LogoutSeller,updateSellerRole,getSingleSeller
}