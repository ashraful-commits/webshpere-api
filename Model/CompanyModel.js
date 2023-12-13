const mongoose = require("mongoose");
//=======================================schema
const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
    },
    location: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
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
    website: {
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
const Company = mongoose.model("Company", companySchema);
module.exports = {
  Company,
};
