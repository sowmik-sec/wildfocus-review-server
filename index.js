const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const services = require("./services.json");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World of expressjs");
});

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
    // this api returns all the review of a single service
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { serviceId: id };
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      const reviewsWithTimestamp = reviews.map((review) => {
        if (!review.timestamp) {
          const currentTime = new Date();
          review.timestamp = currentTime.toLocaleString();
        }
        return review;
      });
      res.send(reviewsWithTimestamp);
    });
    // this api returns current user reviews
    app.get("/my-review", async (req, res) => {
      const query = { email: req.query.email };
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });
    // this api returns a single review
    app.get("/review-single/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });
    app.post("/review", async (req, res) => {
      const review = req.body;
      const currentTime = new Date();
      review.timestamp = currentTime.toLocaleString();
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log("wildfocus review server is listening on port ", port);
});
