/**
 * EXPORT ALL RESOURCE
 */

const expressAsyncHandler = require("express-async-handler");
const { Company } = require("../Model/CompanyModel");
const { cloudUploads } = require("../Utils/Cloudinary");

const getAllCompany = expressAsyncHandler(async (req, res) => {
  try {
    const company = await Company.find();

    if (company.length <= 0) {
      return res.status(400).json({ message: "" });
    } else {
      return res.status(200).json({ company: company });
    }
  } catch (error) {
    console.error(error);
  }
});
/**
 * DELETE CLIENT
 * DELETE METHOD
 */
const deleteCompany = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(400).json({ message: "Not company deleted" });
    }

    res.status(200).json({ company: company, message: "company deleted" });
  } catch (error) {
    console.log(error.message);
  }
});
/**
 * UPDATE
 * UPDATE SINGLE CLIENT
 */

const updateCompany = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      location,
      contact,
      email,
      course,
      desc,
      team,
      testimonial,
      tools,
    } = req.body;

    let companyAvatar;
    if (req.file) {
      companyAvatar = await cloudUploads(req.file.path);
    }
    const updatedData = await Company.findByIdAndUpdate(
      id,
      {
        companyName,
        location,
        contact,
        email,
        companyLogo: companyAvatar,
        course,
        desc,
        team,
        testimonial,
        tools,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ company: updatedData, message: "Not Updated!" });
    } else {
      return res
        .status(200)
        .json({ company: updatedData, message: "Company Updated!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 *POST
 *CREATE CLIENT
 */
const createCompany = expressAsyncHandler(async (req, res) => {
  try {
    const {
      companyName,
      location,
      contact,
      email,
      course,
      desc,
      team,
      testimonial,
      tools,
    } = req.body;
    const isExist = await Company.findOne({ companyName });
    if (isExist) {
      return res.status(400).json({ message: "Already created" });
    }
    let companyAvatar;
    if (req.file) {
      companyAvatar = await cloudUploads(req.file.path);
    }
    const companyData = await Company.create({
      companyName,
      location,
      contact,
      email,
      course,
      desc,
      team,
      testimonial,
      tools,
      companyLogo: companyAvatar,
    });

    if (!companyData) {
      return res.status(400).json({ message: "No company created" });
    } else {
      return res
        .status(200)
        .json({ company: companyData, message: "company created & pending" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PROJECT STATUS UPDATE
 * PATCH METHOD
 */
const companyStatusUpdate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const companyStatusData = await Company.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!companyStatusData) {
      return res.status(400).json({ message: "Project status not updated" });
    } else {
      return res.status(200).json({
        company: companyStatusData,
        message: "Project status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getAllCompany,
  deleteCompany,
  updateCompany,
  createCompany,
  companyStatusUpdate,
};
