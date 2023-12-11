/**
 * EXPORT ALL RESOURCE
 */

const expressAsyncHandler = require("express-async-handler");
const { Client } = require("../Model/ClientModel");
const { Seller } = require("../Model/SellerModel");
const {
  cloudUploads,
  cloudDownload,
  cloudDelete,
} = require("../Utils/Cloudinary");
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
    // const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const role = req.query.role || "user";
    const skip = (page - 1) * limit;
    const client = await Client.find()
      .populate({ path: "sellerId", model: "Seller" })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    if (client.length <= 0) {
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
    const client = await Client.findById(id).populate([
      {
        path: "sellerId",
        model: "Seller",
        populate: { path: "salesPerson", model: "Seller" },
      },
      { path: "team", model: "Seller" },
    ]);
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
      projectSource,
      sellerId,
      clientEmail,
      clientPhone,
      country,
      state,
      clientAddress,
      companyName,
      projectName,
      client,
      projectType,
      budget,
      amount,
      projectDesc,
      timeFrame,
      date,
      paymentReceived,
      label,
      invoices,
      comments,
      team,
      tools,
      feedBack,
      commissionRate,
      salesCommissionRate,
    } = req.body;

    const updateFiles = await Client.findById(id);
    const projectFiles =
      updateFiles?.projectFile?.length > 0 ? updateFiles?.projectFile : [];

    if (req.files && Array.isArray(req.files["projectFile"])) {
      for (let i = 0; i < req.files["projectFile"].length; i++) {
        const fileUrl = await cloudUploads(req.files["projectFile"][i].path);
        projectFiles.push(fileUrl);
      }
    }
    let avatar;

    if (
      req.files &&
      Array.isArray(req.files["clientAvatar"]) &&
      req.files["clientAvatar"][0]
    ) {
      avatar = await cloudUploads(req.files["clientAvatar"][0].path);
    }
    const updateFileAndAvatar = await Client.findById(id);
    if (projectFiles.length > 0) {
      updateFileAndAvatar.projectFile.forEach(async (item) => {
        await cloudDelete(publicIdGenerator(item));
      });
    }
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
        companyName,
        projectName,
        client,
        projectType,
        budget,
        amount,
        projectDesc,
        timeFrame,
        projectFile: projectFiles && projectFiles,
        date,
        paymentReceived,
        label,
        projectSource,
        invoices,
        comments,
        team,
        tools,
        feedBack,
        commissionRate,
        projectStatus: "pending",
        sellerId,
        salesCommissionRate,
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
      projectSource,
      password,
      sellerId,
      clientEmail,
      clientPhone,
      country,
      state,
      clientAddress,
      companyName,
      projectName,
      projectType,
      budget,
      amount,
      projectDesc,
      timeFrame,
      date,
      paymentReceived,
      label,
      invoices,
      comments,
      team,
      feedBack,
      commissionRate,
      salesCommissionRate,
    } = req.body;
    let projectFiles = [];
    if (req.files["projectFile"]) {
      if (req.files["projectFile"]) {
        for (let i = 0; i < req.files["projectFile"].length; i++) {
          const fileUrl = await cloudUploads(req.files["projectFile"][i].path);
          projectFiles.push(fileUrl);
        }
      }
    }
    let avatar;
    if (
      req.files &&
      req.files["clientAvatar"] &&
      req.files["clientAvatar"][0]
    ) {
      avatar = await cloudUploads(req.files["clientAvatar"][0].path);
    }

    await sendEMail(clientEmail, "Client login details", {
      email: clientEmail,
      name: clientName,
      password,
    });
    const clientData = await Client.create({
      clientName,
      clientEmail,
      clientPhone,
      country,
      state,
      clientAddress,
      clientAvatar: avatar ? avatar : null,
      companyName,
      projectName,
      projectType,
      budget,
      amount,
      projectDesc,
      timeFrame,
      password: await makeHash(password),

      projectFile: projectFiles ? projectFiles : null,
      date,
      paymentReceived,
      label,
      projectSource,
      invoices,
      comments,
      team,
      feedBack,
      commissionRate,
      salesCommissionRate,
      projectStatus: "pending",
      sellerId,
    });

    if (!clientData) {
      return res.status(400).json({ message: "No client created" });
    } else {
      await Seller.findByIdAndUpdate(sellerId, {
        $push: {
          client: clientData?._id,
          projects: clientData?._id,
        },
      });
      return res
        .status(200)
        .json({ client: clientData, message: "Client created & pending" });
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
const PermissionUpdated = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const permission = await Client.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!permission) {
      return res.status(400).json({ message: "Permission not updated!" });
    } else {
      return res
        .status(200)
        .json({ client: permission, message: "permission updated" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * PROJECT STATUS UPDATE
 * PATCH METHOD
 */
const projectStatusUpdate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus } = req.body;

    const projectStatusData = await Client.findByIdAndUpdate(
      id,
      { projectStatus },
      { new: true }
    );
    if (!projectStatusData) {
      return res.status(400).json({ message: "Project status not updated" });
    } else {
      return res
        .status(200)
        .json({ client: projectStatusData, message: "Project status updated" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * PROJECT COMMISSION
 * PATCH METHOD
 */
const updateCommissionRate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;

    const commissionRateData = await Client.findByIdAndUpdate(
      id,
      { commissionRate },
      { new: true }
    );
    if (!commissionRateData) {
      return res
        .status(400)
        .json({ message: "Project Commission not updated" });
    } else {
      return res.status(200).json({
        client: commissionRateData,
        message: "Commission status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
const updateSalesCommissionRate = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { salesCommissionRate } = req.body;

    const salescommissionRateData = await Client.findByIdAndUpdate(
      id,
      { salesCommissionRate },
      { new: true }
    );
    if (!salescommissionRateData) {
      return res
        .status(400)
        .json({ message: "Project Commission not updated" });
    } else {
      return res.status(200).json({
        client: salescommissionRateData,
        message: "Commission status updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/**
 * FILE DOWNLOAD
 * GET METHOD
 */
const fileDownload = expressAsyncHandler(async (req, res) => {
  try {
    const { url, fileFormat } = req.params;
    const decodedUrl = decodeURIComponent(url);
    const publicId = publicIdGenerator(decodedUrl);
    const downloadUrl = await cloudDownload(publicId, fileFormat);

    return res.json({ downloadUrl });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/***
 * GET
 * LOGIN DATA
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
/***
 * GET
 * LOGIN OUT
 */
const deleteFiles = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req.body;
    const updateFile = await Client.findById(id);

    await cloudDelete(publicIdGenerator(file));
    const filterFileData = updateFile.projectFile.filter(
      (item) => item !== file
    );
    updateFile.projectFile = filterFileData;
    updateFile.save();
    res.status(200).json({ client: updateFile });
  } catch (error) {
    console.log(error);
  }
});
module.exports = {
  getAllClient,
  createClient,
  deleteClient,
  updateClient,
  PermissionUpdated,
  projectStatusUpdate,
  getSingleClient,
  updateCommissionRate,
  fileDownload,
  ClientLogin,
  me,
  LogoutClient,
  deleteFiles,
  updateSalesCommissionRate,
};
