const mongoose = require("mongoose");
//=======================================schema
const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    companyLogo: {
      type: String,
      default: null,
    },
    course: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      default: "",
    },
    team: {
      type: Array,
      default: [],
    },
    testimonial: {
      type: Array,
      default: [],
    },
    tools: {
      type: Array,
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
const Company = mongoose.model("company", companySchema);
module.exports = {
  Company,
};
