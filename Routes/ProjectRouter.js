const express = require("express");
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getSingleProject,
  PermissionUpdated,
  projectStatusUpdate,
  updateCommissionRate,
  updateSalesCommissionRate,
  AddMoreFile,
  deleteFiles,
} = require("../Controller/ProjectController.js");
const { projectFiles } = require("../Middleware/Multer.js");

const ProjectRouter = express.Router();

ProjectRouter.route("/").get(getAllProjects).post(projectFiles, createProject);
ProjectRouter.route("/:id")
  .put(projectFiles, updateProject)
  .delete(deleteProject)
  .get(getSingleProject)
  .patch(PermissionUpdated);
ProjectRouter.route("/projectStatusUpdate/:id").patch(projectStatusUpdate);
ProjectRouter.route("/commissionRate/:id").patch(updateCommissionRate);
ProjectRouter.route("/salescommissionRate/:id").patch(
  updateSalesCommissionRate
);
ProjectRouter.route("/file/:url/:fileFormat").get(updateSalesCommissionRate);
module.exports = ProjectRouter;
ProjectRouter.route("/deletefile/:id").post(deleteFiles);
ProjectRouter.route("/addmorefile/:id").post(projectFiles, AddMoreFile);
module.exports = ProjectRouter;
