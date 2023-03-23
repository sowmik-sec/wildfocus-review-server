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
  res.send(services);
});
app.get("/services-3", (req, res) => {
  res.send(services.slice(0, 3));
});

app.listen(port, () => {
  console.log("wildfocus review server is listening on port ", port);
});
