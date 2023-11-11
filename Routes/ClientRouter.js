
const  express  = require( 'express');
const {  getAllClient, createClient, deleteClient, updateClient, PermissionUpdated, projectStatusUpdate, getSingleClient, updateCommissionRate, fileDownload }  = require(  '../Controller/ClientController.js');
const {  multipleFields} = require('../Middleware/Multer.js');


const clientRouter = express.Router()

clientRouter.route("/").post(multipleFields,createClient)
clientRouter.route("/:id").get(getAllClient).delete(deleteClient)
clientRouter.route("/:id").put(multipleFields,updateClient).patch(PermissionUpdated)
clientRouter.route("/projectStatusUpdate/:id").patch(projectStatusUpdate)
clientRouter.route("/clientId/:id").get(getSingleClient)
clientRouter.route("/commissionRate/:id").patch(updateCommissionRate)
clientRouter.route("/file/:url/:fileFormat").get(fileDownload);



module.exports =clientRouter