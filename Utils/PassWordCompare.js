const bcrypt =require("bcryptjs")
 const comparePasswords=async( password,oldPassword)=>{
    try {
      const passwordMatches = await bcrypt.compare(password,oldPassword);
      return passwordMatches;
    } catch (error) {
      throw error;
    }
  }
  //======================================comparePasswords
module.exports = {comparePasswords}