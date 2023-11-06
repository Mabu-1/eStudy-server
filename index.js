

const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//romanami652
//3cll9d7TvTc8ybam



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0st1zs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const assignmentCollection = client.db("userDB").collection("assignment");
        app.get("/assignment", async (req, res) => {
            const result = await assignmentCollection.find().toArray();
            console.log(result);
            res.send(result);
          });
      

        app.post("/assignment", async (req, res) => {
            try {
                const body = req.body;
                const result = await assignmentCollection.insertOne(body);
                console.log(result);
                res.send(result);

                
            } catch (error) {
                console.log(error);

            }

        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Crud is runnissng .....");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
