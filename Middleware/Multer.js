const multer = require("multer");
/**
 * STORAGE CREATE
 */
const Storages = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + Math.round(Math.random() * 10000) + "-" + file.fieldname
    );
  },
});
/**
 * CLIENT  AVATAR MULTER
 */
const clientAvatar = multer({
  storage: Storages,
}).single("clientAvatar");
/**
 * SELLER  AVATAR MULTER
 */
const sellerAvatar = multer({
  storage: Storages,
}).single("sellerAvatar");
//  * COMPANY  AVATAR MULTER
//  */
const companyAvatarUpload = multer({
  storage: Storages,
}).single("companyAvatar");
/**
 * PROJECT FILE  MULTER
 */
const projectFiles = multer({
  storage: Storages,
}).array("projectFile", 20);
/**
 * CLIENT  MULTIPLE MULTER
 */
/**
 * SELLER  MULTIPLE MULTER
 */
const sellerMultiAvatar = multer({
  storage: Storages,
}).fields([{ name: "sellerAvatar" }, { name: "companyAvatar" }]);

module.exports = {
  clientAvatar,
  sellerAvatar,
  projectFiles,
  sellerMultiAvatar,
  companyAvatarUpload,
};
