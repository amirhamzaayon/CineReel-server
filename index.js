require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://cinereel-optional.web.app",
      "https://cinereel-optional.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bcwzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const MoviesInfo = client.db("CineReel").collection("MoviesInfo");
    const Wishlists = client.db("CineReel").collection("Wishlists");

    // get all movies
    app.get("/movies", async (req, res) => {
      const cursor = MoviesInfo.find({});
      const movies = await cursor.toArray();
      res.send(movies);
    });

    // get a single movie
    app.get("/moviedetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const movie = await MoviesInfo.findOne(query);
      res.send(movie);
    });

    // add a movie
    app.post("/add-movie", async (req, res) => {
      const movie = req.body;
      const result = await MoviesInfo.insertOne(movie);
      res.send(result);
    });

    // add to wishlist
    app.post("/add-to-wishlist", async (req, res) => {
      const { userEmail, movieId, movieTitle } = req.body;

      // Update the user's wishlist array by adding the movieId if it's not already present.
      const result = await Wishlists.updateOne(
        { userEmail: userEmail },
        {
          $addToSet: {
            userEmail: userEmai,
            wishlist: movieId,
            movieTitle: movieTitle,
          },
        },
        { upsert: true }
      );

      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("complete initial server setup for CineReel"); //
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
