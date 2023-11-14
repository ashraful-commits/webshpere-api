
const  express  = require( 'express');
const {  getAllClient, createClient, deleteClient, updateClient, PermissionUpdated, projectStatusUpdate, getSingleClient, updateCommissionRate, fileDownload }  = require(  '../Controller/ClientController.js');
const {  multipleFields} = require('../Middleware/Multer.js');


const clientRouter = express.Router()
//==========================================create client
clientRouter.route("/").post(multipleFields,createClient)
//==========================================delete client
clientRouter.route("/:id").get(getAllClient).delete(deleteClient)
//==========================================permission client
clientRouter.route("/:id").put(multipleFields,updateClient).patch(PermissionUpdated)
//========================================== client status update
clientRouter.route("/projectStatusUpdate/:id").patch(projectStatusUpdate)
//========================================== get single client
clientRouter.route("/clientId/:id").get(getSingleClient)
//========================================== update client commission Rate
clientRouter.route("/commissionRate/:id").patch(updateCommissionRate)
//========================================== fille download
clientRouter.route("/file/:url/:fileFormat").get(fileDownload);

//==========================================export router
module.exports =clientRouter