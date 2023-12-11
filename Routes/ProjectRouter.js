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
} = require("../Controller/ProjectController.js");
const { projectFiles } = require("../Middleware/Multer.js");

const ProjectRouter = express.Router();

ProjectRouter.route("/").get(getAllProjects).post(projectFiles, createProject);
ProjectRouter.route("/:id")
  .post(projectFiles, updateProject)
  .delete(deleteProject)
  .get(getSingleProject)
  .patch(PermissionUpdated);
ProjectRouter.route("/projectStatusUpdate/:id").patch(projectStatusUpdate);
ProjectRouter.route("/commissionRate/:id").patch(updateCommissionRate);
ProjectRouter.route("/salescommissionRate/:id").patch(
  updateSalesCommissionRate
);

module.exports = ProjectRouter;
