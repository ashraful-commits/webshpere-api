
const  express = require('express');
const { createProject, getAllProjects }= require('../Controller/ProjectController.js');
const { projectFiles }= require('../Middleware/Multer.js');

const ProjectRouter = express.Router()

ProjectRouter.route("/").get(getAllProjects).post( projectFiles, createProject)

module.exports =ProjectRouter