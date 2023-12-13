const mongoose = require("mongoose");
//=======================================schema
const projectSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Company",
    },
    projectSource: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Seller",
    },
    projectName: {
      type: String,
    },
    projectType: {
      type: String,
    },
    budget: {
      type: String,
    },
    amount: {
      type: Number,
    },
    projectDesc: {
      type: String,
    },
    timeFrame: {
      type: String,
      default: "30 days",
    },
    projectFile: {
      type: Array,
    },
    date: {
      type: String,
    },
    tools: {
      type: Array,
      default: [],
    },
    paymentReceived: {
      type: Number,
    },
    label: {
      type: Array,
    },
    invoices: {
      type: Array,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    team: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Seller",
    },
    feedBack: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    commissionRate: {
      type: String,
      default: "15",
    },
    salesCommissionRate: {
      type: String,
      default: "5",
    },
    projectStatus: {
      type: String,
      default: "pending",
    },
    projectSource: {
      type: String,
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
const Project = mongoose.model("Project", projectSchema);
module.exports = {
  Project,
};
