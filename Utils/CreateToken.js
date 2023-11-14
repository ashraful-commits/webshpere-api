const jwt =require("jsonwebtoken");
 const makeToken = (data, jwtF = process.env.JWT_SECRECT, exp = "7d") => {
  const jwtToken = jwt.sign(data, jwtF, { expiresIn: exp });
  return jwtToken;
};
//========================================makeToken
module.exports = {makeToken}