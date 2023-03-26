const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const reviewCollection = client.db("wildFocusReview").collection("review");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services-3", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { serviceId: id };
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.post("/review", async (req, res) => {
      const review = req.body;
      const currentTime = new Date();
      review.timestamp = currentTime;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

// app.get("/services-3", (req, res) => {
//   res.send(services.slice(0, 3));
// });
// app.get("/services/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log(id);
//   const service = services.find((srv) => srv.id === id);
//   res.send(service);
// });

app.listen(port, () => {
  console.log("wildfocus review server is listening on port ", port);
});
