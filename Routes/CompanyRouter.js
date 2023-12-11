const express = require("express");
const { companyAvatarUpload } = require("../Middleware/Multer");
const {
  createCompany,
  updateCompany,
  companyStatusUpdate,
  deleteCompany,
  getAllCompany,
} = require("../Controller/companyController");

const companyRouter = express.Router();
//==========================================create company
companyRouter
  .route("/")
  .post(companyAvatarUpload, createCompany)
  .get(getAllCompany);
companyRouter
  .route("/:id")
  .put(companyAvatarUpload, updateCompany)
  .patch(companyStatusUpdate)
  .delete(deleteCompany);

module.exports = companyRouter;
