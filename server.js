const express =require("express");
const dotenv =require("dotenv");
const colors =require("colors");
const cors =require("cors");
const cookiesParser =require("cookie-parser")
const { ErrorHandler } =require("./Middleware/ErrorHandler.js");
const { MongoDBConnection } =require("./Config/MongoDB.js");
const clientRouter =require("./Routes/ClientRouter.js");
const ProjectRouter =require("./Routes/ProjectRouter.js");
const sellerRouter =require("./Routes/SallerRouter.js");
const path = require("path")
//===============================================> dotenv config
dotenv.config();
//===============================================> evn
const port = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookiesParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("api/public"));
//================================================> routes
app.use(ErrorHandler)
app.use("/api/v1/client",clientRouter)
app.use("/api/v1/project",ProjectRouter)
app.use("/api/v1/seller",sellerRouter)
//==========================================deployment

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

//================================================> create server
app.listen(port, () => {
  MongoDBConnection()
  console.log(`Server running on port ${port}`.bgCyan.yellow);
});
console.log(path.join(__dirname, "client", "dist", "index.html"))