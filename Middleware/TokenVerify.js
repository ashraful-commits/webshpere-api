const jwt =require("jsonwebtoken");
const expressAsyncHandler =require("express-async-handler");
const { Seller } = require("../Model/SellerModel");
/**
*TOKEN VERIFY FUNCTION
*/
 const tokenVerify = (req, res, next) => {
 //============================accessToken 
  const accessToken = req?.cookies?.accessToken || req?.headers?.authorization;
//============================= Not accessToken
  if (!accessToken) {
   return res.status(404).json({ message: "not authorize" });
  } 
//================================== check Token
  const checkToken=  jwt.verify(
      accessToken,
      process.env.JWT_SECRECT,
      expressAsyncHandler(async (err, decode) => {
        if(err) res.status(404).json({ message: "Not user" });
        const me = await Seller.findOne({ email: decode?.email }).populate({path:"client",
        model:"Client"}).populate({
          path:"projects",
          model:"Client"
        }).populate({
          path:"salesPerson",
          model:"Seller"
        });
        req.me = me;
        next();
      })
    );
  
};
//===================================export
module.exports={
  tokenVerify
}