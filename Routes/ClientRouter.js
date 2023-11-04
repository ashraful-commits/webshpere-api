
const  express  = require( 'express');
const { createClient, getAllClient }  = require(  '../Controller/ClientController.js');
const { clientAvatar } =require ('./../Middleware/Multer.js');

const clientRouter = express.Router()

clientRouter.route("/").get(getAllClient).post(clientAvatar,createClient)



module.exports =clientRouter