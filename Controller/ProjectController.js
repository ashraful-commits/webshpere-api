/***
GET
GET ALL PROJECTS
*/
const expressAsyncHandler = require("express-async-handler");
const { cloudUploads, cloudDelete } = require("../Utils/Cloudinary");
const { Project } = require("../Model/ProjectModel");
const publicIdGenerator = require("../Utils/PublicKeyGeneretor");
const { Seller } = require("../Model/SellerModel");
const { Client } = require("../Model/ClientModel");

const getAllProjects = expressAsyncHandler(async (req, res) => {
  try {
    const project = await Project.find()
      .populate({ path: "sellerId", model: "Seller" })
      .populate({ path: "clientId", model: "Client" })
      .populate({ path: "company", model: "Company" })
      .sort({ createdAt: -1 });
    if (project.length < 0) {
      return res.status(400).json({ message: "No project " });
    } else {
      return res
        .status(200)
        .json({ project: project, message: "All Projects" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
/***
PUT
UPDATE PROJECTS
*/
const updateProject = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientId,
      sellerId,
      companyName,
      projectName,
      projectType,
      budget,
      amount,
      projectDesc,
      projectSource,
      timeFrame,
      date,
      paymentReceived,
      label,
      invoices,
      comments,
      team,
      tools,
      feedBack,
      commissionRate,
      salesCommissionRate,
    } = req.body;

    const updateFiles = await Project.findById(id);
    const projectFiles =
      updateFiles?.projectFile?.length > 0 ? updateFiles?.projectFile : [];

    if (req.files && Array.isArray(req.files)) {
      for (let i = 0; i < req.files.length; i++) {
        const fileUrl = await cloudUploads(req.files[i].path);
        projectFiles.push(fileUrl);
      }
    }

    const updateFileAndAvatar = await Project.findById(id);
    if (projectFiles.length > 0) {
      updateFileAndAvatar.projectFile.forEach(async (item) => {
        await cloudDelete(publicIdGenerator(item));
      });
    }

    const updatedData = await Project.findByIdAndUpdate(
      id,
      {
        companyName,
        projectName,
        clientId,
        projectType,
        budget,
        amount,
        projectDesc,
        timeFrame,
        projectFile: projectFiles && projectFiles,
        date,
        paymentReceived,
        label,
        projectSource,
        invoices,
        comments,
        team,
        tools,
        feedBack,
        commissionRate,
        projectStatus: "pending",
        sellerId,
        salesCommissionRate,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ project: updatedData, message: "Not Updated!" });
    } else {
      return res
        .status(200)
        .json({ project: updatedData, message: "Project Updated!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/***
POST
CREATE PROJECTS
*/
const createProject = expressAsyncHandler(async (req, res) => {
  try {
    const {
      projectName,
      clientId,
      projectType,
      budget,
      amount,
      projectDesc,
      projectSource,
      timeFrame,
      date,
      paymentReceived,
      label,
      invoices,
      comments,
      team,
      feedBack,
      commissionRate,
      projectStatus,
      sellerId,
      company,
    } = req.body;

    let projectFiles = [];
    if (req.files) {
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const fileUrl = await cloudUploads(req.files[i].path);
          projectFiles.push(fileUrl);
        }
      }
    }
    const project = await Project.create({
      projectName,
      clientId,
      projectType,
      budget,
      amount,
      projectDesc,
      timeFrame,
      projectFile: projectFiles ? projectFiles : null,
      date,
      paymentReceived,
      label,
      invoices,
      comments,
      team,
      feedBack,
      commissionRate,
      projectStatus,
      projectSource,
      sellerId,
      company,
    });
    if (!project) {
      return res.status(400).json({ message: "No project create" });
    } else {
      await Seller.findByIdAndUpdate(sellerId, {
        $push: { projects: project?._id },
      });
      await Client.findByIdAndUpdate(clientId, {
        $push: { projects: project?._id },
      });
      return res
        .status(200)
        .json({ project: project, message: "Project create" });
    }
  } catch (error) {
    console.log(error);
  }
});
/***
DELETE
DELETE PROJECTS
*/
const deleteProject = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(400).json({ message: "Not project deleted" });
    } else {
      await Seller.findByIdAndUpdate(project?.sellerId, {
        $pull: { projects: project?._id },
      });
      await Client.findByIdAndUpdate(project?.clientId, {
        $pull: { projects: project?._id },
      });
      if (project.projectFile) {
        project.projectFile.forEach(async (element) => {
          await cloudDelete(publicIdGenerator(element));
        });
      }

      return res
        .status(200)
        .json({ project: project, message: "project deleted" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
/**
 * GET
 * GET SINGLE project
 */
const getSingleProject = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate({
        path: "sellerId",
        model: "Seller",
        populate: { path: "salesPerson", model: "Seller" },
      })
      .populate({ path: "clientId", model: "Client" })
      .populate({ path: "company", model: "Company" })
      .populate({ path: "team", model: "Seller" });
    if (!project) {
      return res.status(400).json({ message: "Not project" });
    } else {
      return res.status(200).json({ project: project, message: "" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
/**
 * UPDATE
 * UPDATE PERMISSION
 */
const PermissionUpdated = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const permission = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!permission) {
      return res.status(400).json({ message: "Permission not updated!" });
    } else {
      return res
        .status(200)
        .json({ project: permission, message: "permission updated" });
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
const projectStatusUpdate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus } = req.body;

    const projectStatusData = await Project.findByIdAndUpdate(
      id,
      { projectStatus },
      { new: true }
    );
    if (!projectStatusData) {
      return res.status(400).json({ message: "Project status not updated" });
    } else {
      return res.status(200).json({
        project: projectStatusData,
        message: "Project status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * PROJECT COMMISSION
 * PATCH METHOD
 */
const updateCommissionRate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;

    const commissionRateData = await Project.findByIdAndUpdate(
      id,
      { commissionRate },
      { new: true }
    );
    if (!commissionRateData) {
      return res
        .status(400)
        .json({ message: "Project Commission not updated" });
    } else {
      return res.status(200).json({
        project: commissionRateData,
        message: "Commission status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * PATCH
 * UPDATE SALES COMMISSION RATE
 */
const updateSalesCommissionRate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { salesCommissionRate } = req.body;

    const salescommissionRateData = await Project.findByIdAndUpdate(
      id,
      { salesCommissionRate },
      { new: true }
    );
    if (!salescommissionRateData) {
      return res
        .status(400)
        .json({ message: "Project Commission not updated" });
    } else {
      return res.status(200).json({
        project: salescommissionRateData,
        message: "Commission status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * FILE DOWNLOAD
 * GET METHOD
 */
const fileDownload = expressAsyncHandler(async (req, res) => {
  try {
    const { url, fileFormat } = req.params;
    const decodedUrl = decodeURIComponent(url);
    const publicId = publicIdGenerator(decodedUrl);
    const downloadUrl = await cloudDownload(publicId, fileFormat);

    return res.json({ downloadUrl });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * DELETE
 * DELETE FILE
 */
const deleteFiles = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req.body;
    const updateFile = await Project.findById(id);
    await cloudDelete(publicIdGenerator(file));
    const filterFileData = updateFile.projectFile.filter(
      (item) => item !== file
    );
    updateFile.projectFile = filterFileData;
    updateFile.save();
    res.status(200).json({ project: updateFile, message: "file deleted!" });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * UPLOAD FILE
 */
const AddMoreFile = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = await Project.findById(id);
    let projectFiles = projectData.projectFile || [];
    if (req.files) {
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const fileUrl = await cloudUploads(req.files[i].path);
          projectFiles.push(fileUrl);
        }
      }
    }
    //================================find project
    const project = await Project.findByIdAndUpdate(
      id,
      {
        projectFile: projectFiles,
      },
      { new: true }
    );
    if (project) {
      return res.status(200).json({ message: "File add" });
    }
  } catch (error) {
    console.log(error);
  }
});
//================================EXPORT
module.exports = {
  createProject,
  getAllProjects,
  PermissionUpdated,
  projectStatusUpdate,
  updateCommissionRate,
  updateSalesCommissionRate,
  fileDownload,
  deleteFiles,
  updateProject,
  deleteProject,
  getSingleProject,
  AddMoreFile,
};
