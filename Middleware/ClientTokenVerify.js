const jwt =require("jsonwebtoken");
const expressAsyncHandler =require("express-async-handler");

const { Client } = require("../Model/ClientModel");
/**
*TOKEN VERIFY FUNCTION
*/
 const ClientTokenVerify = (req, res, next) => {
 //============================accessToken 
  const clientToken = req?.cookies?.clientToken || req?.headers?.authorization;
//============================= Not accessToken
  if (!clientToken) {
   return res.status(404).json({ message: "not authorize" });
  } 
//================================== check Token
  const checkToken=  jwt.verify(
    clientToken,
      process.env.JWT_SECRECT,
      expressAsyncHandler(async (err, decode) => {
        if(err) res.status(404).json({ message: "Not user" });
        const me = await Client.findOne({ email: decode?.email })
        req.me = me;
        next();
      })
    );
  
};
//===================================export
module.exports={
  ClientTokenVerify
}