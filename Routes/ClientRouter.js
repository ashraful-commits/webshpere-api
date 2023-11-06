
const  express  = require( 'express');
const {  getAllClient, createClient }  = require(  '../Controller/ClientController.js');
const { clientAvatar, projectFiles } = require('../Middleware/Multer.js');


const clientRouter = express.Router()

clientRouter.route("/").get(getAllClient).post(clientAvatar,createClient)



module.exports =clientRouter