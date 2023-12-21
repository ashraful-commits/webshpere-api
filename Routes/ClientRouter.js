const express = require("express");
const {
  getAllClient,
  createClient,
  deleteClient,
  updateClient,
  getSingleClient,
  ClientLogin,
  me,
  LogoutClient,
  permissionUpdate,
} = require("../Controller/ClientController.js");
const { ClientTokenVerify } = require("../Middleware/ClientTokenVerify.js");
const { clientAvatar } = require("../Middleware/Multer.js");

const clientRouter = express.Router();
//==========================================create client
clientRouter.route("/").post(clientAvatar, createClient);
clientRouter.route("/login").post(ClientLogin);
//==========================================delete client
clientRouter.route("/").get(getAllClient);
//==========================================permission client
clientRouter
  .route("/:id")
  .put(clientAvatar, updateClient)
  .delete(deleteClient)
  .patch(permissionUpdate);

//========================================== get single client
clientRouter.route("/clientId/:id").get(getSingleClient);

clientRouter.route("/me").get(ClientTokenVerify, me);
clientRouter.route("/logout").get(LogoutClient);
//==========================================export router
module.exports = clientRouter;
