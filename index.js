const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const services = require("./services.json");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World of expressjs");
});

// pass: f0nGTcho5GzNpIyU
// user: wildfocusreview

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xgh8h2c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const serviceCollection = client
      .db("wildFocusReview")
      .collection("services");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

// app.get("/services", (req, res) => {
//   res.send(services);
// });
app.get("/services-3", (req, res) => {
  res.send(services.slice(0, 3));
});
app.get("/services/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const service = services.find((srv) => srv.id === id);
  res.send(service);
});

app.listen(port, () => {
  console.log("wildfocus review server is listening on port ", port);
});
