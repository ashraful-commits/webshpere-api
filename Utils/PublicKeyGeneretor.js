const publicIdGenerator = (url) => {
  return url?.split("/")[url?.split("/").length - 1]?.split(".")[0];
};
//======================================publicIdGenerator
module.exports = publicIdGenerator;
