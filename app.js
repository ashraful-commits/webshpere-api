const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const { ErrorHandler } = require("./Middleware/ErrorHandler.js");
const { MongoDBConnection } = require("./Config/MongoDB.js");

//==========================================all router import
const path = require("path");
const clientRouter = require("./Routes/ClientRouter.js");
const ProjectRouter = require("./Routes/ProjectRouter.js");
const sellerRouter = require("./Routes/SallerRouter.js");
const companyRouter = require("./Routes/CompanyRouter.js");
//===============================================> dotenv config
dotenv.config();
//===============================================> evn
const port = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://wordsphere.vercel.app"],
    credentials: true,
  })
);
app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("api/public"));
//================================================> routes
app.use(ErrorHandler);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/project", ProjectRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/company", companyRouter);

//================================================> create server
app.listen(port, () => {
  MongoDBConnection();
  console.log(`Server running on port ${port}`.bgCyan.yellow);
});
