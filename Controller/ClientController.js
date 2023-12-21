/**
 * EXPORT ALL RESOURCE
 */

const expressAsyncHandler = require("express-async-handler");
const { Client } = require("../Model/ClientModel");
const { Seller } = require("../Model/SellerModel");
const { cloudUploads, cloudDelete } = require("../Utils/Cloudinary");
const publicIdGenerator = require("../Utils/PublicKeyGeneretor");
const { makeHash } = require("../Utils/CreateHashPassword");
const sendEMail = require("../Middleware/SendMail");
const { comparePasswords } = require("../Utils/PassWordCompare");
const { makeToken } = require("../Utils/CreateToken");
/*
 * GET ALL CLIENT
 * GET METHOD
 */
const getAllClient = expressAsyncHandler(async (req, res) => {
  try {
    const client = await Client.find()
      .populate({
        path: "sellerId",
        model: "Seller",
      })
      .populate({
        path: "company",
        model: "Company",
      })
      .populate({
        path: "projects",
        model: "Project",
      });

    if (client.length < 0) {
      return res.status(400).json({ message: "" });
    } else {
      return res.status(200).json({ client: client });
    }
  } catch (error) {
    console.error(error);
  }
});
/**
 * DELETE CLIENT
 * DELETE METHOD
 */
const deleteClient = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(400).json({ message: "Not client deleted" });
    } else {
      if (client.clientAvatar) {
        await cloudDelete(publicIdGenerator(client.clientAvatar));
      }
      if (client.projectFile) {
        client.projectFile.forEach(async (element) => {
          await cloudDelete(publicIdGenerator(element));
        });
      }
      const updateSeller = await Seller.updateMany(
        { $or: [{ client: client?._id }, { projects: client?._id }] },
        {
          $pull: {
            client: client?._id,
            projects: client?._id,
          },
        }
      );

      return res
        .status(200)
        .json({ client: client, message: "client deleted" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
/**
 * GET
 * GET SINGLE CLIENT
 */
const getSingleClient = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).populate({
      path: "sellerId",
      model: "Seller",
    });
    if (!client) {
      return res.status(400).json({ message: "Not client" });
    } else {
      return res.status(200).json({ client: client, message: "" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
/**
 * UPDATE
 * PUT METHOD
 * UPDATE CLIENT
 */
const updateClient = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      sellerId,
      clientEmail,
      clientPhone,
      country,
      state,
      clientAddress,
      company,
    } = req.body;

    let avatar;

    if (req.file) {
      avatar = await cloudUploads(req.file.path);
    }
    const updateFileAndAvatar = await Client.findById(id);

    if (avatar) {
      if (updateFileAndAvatar.clientAvatar)
        await cloudDelete(publicIdGenerator(updateFileAndAvatar.clientAvatar));
    }
    const updatedData = await Client.findByIdAndUpdate(
      id,
      {
        clientName,
        clientEmail,
        clientPhone,
        country,
        state,
        clientAddress,
        clientAvatar: avatar && avatar,
        company,
        sellerId,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ client: updatedData, message: "Not Updated!" });
    } else {
      return res
        .status(200)
        .json({ client: updatedData, message: "Client Updated!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
//=======================update client permission
const permissionUpdate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedData = await Client.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json({ client: updatedData, message: "Not Updated!" });
    } else {
      return res
        .status(200)
        .json({ client: updatedData, message: "Client Updated!" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 *POST
 *CREATE CLIENT
 */
const createClient = expressAsyncHandler(async (req, res) => {
  try {
    const {
      clientName,
      password,
      sellerId,
      clientEmail,
      clientPhone,
      country,
      state,
      clientAddress,
      company,
    } = req.body;

    const isExistClient = await Client.findOne({ clientEmail });
    if (isExistClient) {
      return res.status(400).json({ message: "Client Already exist!" });
    } else {
      let avatar;
      if (req.file) {
        avatar = await cloudUploads(req.file.path);
      }
      // await sendEMail(clientEmail, "Client login details", {
      //   email: clientEmail,
      //   name: clientName,
      //   password,
      // });
      const clientData = await Client.create({
        clientName,
        clientEmail,
        clientPhone,
        country,
        state,
        clientAddress,
        clientAvatar: avatar ? avatar : null,
        company,
        password: await makeHash(password),
        sellerId,
      });

      if (!clientData) {
        return res.status(400).json({ message: "No client created" });
      } else {
        await Seller.findByIdAndUpdate(sellerId, {
          $push: {
            client: clientData?._id,
          },
        });
        return res
          .status(200)
          .json({ client: clientData, message: "Client created & pending" });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 *POST
 *CLIENT LOGIN
 */
const ClientLogin = expressAsyncHandler(async (req, res) => {
  try {
    const { clientEmail, password } = req.body;
    const IsExistClient = await Client.findOne({ clientEmail });

    if (!IsExistClient) {
      return res.status(400).json({ message: "Client not exist !" });
    } else {
      const compare = await comparePasswords(password, IsExistClient.password);
      if (!compare) {
        return res.status(400).json({ message: "Password not Match !" });
      } else {
        const Token = await makeToken(
          {
            email: IsExistClient.clientEmail,
            password: IsExistClient.password,
          },
          process.env.JWT_SECRECT,
          "7d"
        );
        const RefToken = await makeToken(
          {
            email: IsExistClient.clientEmail,
            password: IsExistClient.password,
          },
          process.env.REF_JWT_SECRECT,
          "30d"
        );
        res
          .cookie("clientToken", Token, {
            httpOnly: true,
            secure: process.env.APP_ENV === "development" ? false : true,
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
          })
          .status(200)
          .json({
            token: Token,
            refToken: RefToken,
            message: "Login success!",
            client: IsExistClient,
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
/***
 * PATCH METHOD
 * CREATE CLIENT
 */

const me = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.me) {
      return res.status(400).json({ message: "Login please !" });
    } else {
      return res.status(200).json({ client: req.me, message: "" });
    }
  } catch (error) {
    console.log(error);
  }
});
/***
 * GET
 * LOGIN OUT
 */
const LogoutClient = expressAsyncHandler(async (req, res) => {
  try {
    res
      .clearCookie("clientToken", {
        httpOnly: true,
        secure: process.env.APP_ENV === "development" ? false : true,
        sameSite: "Lax",
        maxAge: 0,
      })
      .json({ message: "Logout success!" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getAllClient,
  createClient,
  deleteClient,
  updateClient,
  getSingleClient,
  ClientLogin,
  me,
  LogoutClient,
  permissionUpdate,
};
