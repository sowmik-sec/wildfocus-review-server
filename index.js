const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const services = require("./services.json");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World of expressjs");
});

app.get("/services", (req, res) => {
  res.json(services);
});

app.listen(port, () => {
  console.log("wildfocus review server is listening on port ", port);
});
