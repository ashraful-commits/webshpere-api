
const  express  = require( 'express');
const {  getAllClient, createClient }  = require(  '../Controller/ClientController.js');
const { clientAvatar, projectFiles, multipleFields } = require('../Middleware/Multer.js');


const clientRouter = express.Router()

clientRouter.route("/").get(getAllClient).post(multipleFields,createClient)



module.exports =clientRouter