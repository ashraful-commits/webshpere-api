const bcryptjs =require("bcryptjs");
 const makeHash = async (password) => {
  const salt = await bcryptjs.genSaltSync(10);
  const hashPass = bcryptjs.hash(password, salt);
  return hashPass;
};

//==============================export makeHash
module.exports ={makeHash}