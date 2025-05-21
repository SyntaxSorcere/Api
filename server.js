const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

const dbConnect = require("./Database/database");
dbConnect(); // connect to database

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Router = require('./Router/router');
app.use("/api", Router);

app.get("/", (req, res) => {
  res.send("<h2>Food API Working</h2>");
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
