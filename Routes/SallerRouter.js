
const  express  = require('express');

const { sellerAvatar, sellerMultiAvatar } = require('../Middleware/Multer.js');
const { createSeller, getAllSeller, me, sellerLogin, LogoutSeller, updateSellerRole, getSingleSeller, updateSellerStatus, deleteSeller, updateSeller } = require('../Controller/SellerController.js');
const { tokenVerify } = require('./../Middleware/TokenVerify.js');

const sellerRouter = express.Router()
sellerRouter.route("/").get(getAllSeller).post(sellerMultiAvatar,createSeller)
sellerRouter.route("/login").post(sellerLogin)
sellerRouter.route("/me").get(tokenVerify,me)
sellerRouter.route("/logout").get(LogoutSeller)
sellerRouter.route("/:id").put(updateSellerRole).get(getSingleSeller).patch(updateSellerStatus)
sellerRouter.route("/:id/:sellerId").delete(deleteSeller)
sellerRouter.route("/sellerUpdate/:id").put(sellerMultiAvatar,updateSeller)

module.exports= sellerRouter