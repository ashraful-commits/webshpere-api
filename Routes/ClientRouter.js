
const  express  = require( 'express');
const {  getAllClient, createClient, deleteClient, updateClient }  = require(  '../Controller/ClientController.js');
const {  multipleFields} = require('../Middleware/Multer.js');


const clientRouter = express.Router()

clientRouter.route("/").post(multipleFields,createClient)
clientRouter.route("/:id").get(getAllClient).delete(deleteClient)
clientRouter.route("/:id").put(multipleFields,updateClient)



module.exports =clientRouter