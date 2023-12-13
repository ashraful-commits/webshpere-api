const mongoose = require("mongoose");
//=======================================schema
const clientSchema = mongoose.Schema(
  {
    clientName: {
      type: String,
    },
    clientEmail: {
      type: String,
    },
    clientPhone: {
      type: String,
    },
    password: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Company",
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    clientAddress: {
      type: String,
    },
    clientAvatar: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },
    projects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
      default: [],
    },
    status: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//========================================export schema
const Client = mongoose.model("Client", clientSchema);
module.exports = {
  Client,
};
