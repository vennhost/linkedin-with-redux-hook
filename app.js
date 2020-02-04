const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongooseConnection = require("./src/db/mongoose");
const listEndpoints = require("express-list-endpoints");
require("dotenv").config();
const port = process.env.PORT;
mongooseConnection();
const experienceRouter = require("./src/route/experience");
const profileRouter = require("./src/route/profile");
const postRouter = require("./src/route/post");

app.use(bodyParser.json());

var whitelist = ["http://localhost:3000", "https://faizanbardai.github.io"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));

// app.use(express.json());

app.get("/", (req, res) => res.send("LinkedIn Profile"));

//server.use("/images", express.static(path.join(__dirname, "images")))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/experiences", experienceRouter);
app.use("/profiles", profileRouter);
app.use("/posts", postRouter);

console.log(listEndpoints(app));
app.listen(port, () => console.log(`Your app is listening on port ${port}!`));
