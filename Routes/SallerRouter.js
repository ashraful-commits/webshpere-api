
const  express  = require('express');

const { sellerAvatar } = require('../Middleware/Multer.js');
const { createSeller, getAllSeller, me, sellerLogin, LogoutSeller } = require('../Controller/SellerController.js');
const { tokenVerify } = require('./../Middleware/TokenVerify.js');

const sellerRouter = express.Router()
sellerRouter.route("/").get(getAllSeller).post(sellerAvatar,createSeller)
sellerRouter.route("/login").post(sellerLogin)
sellerRouter.route("/me").get(tokenVerify,me)
sellerRouter.route("/logout").get(LogoutSeller)

module.exports= sellerRouter