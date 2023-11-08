

const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

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
        const submitCollection = client.db("userDB").collection("submit");
        
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

        app.put('/assignment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedAssignment = req.body;
          
            const products = {
                $set: {
          
                    title: updatedAssignment.title,
                    description: updatedAssignment.description,
                    marks: updatedAssignment.marks,
                    thumbnail: updatedAssignment.thumbnail,
                    difficulty: updatedAssignment.difficulty,
                    dueDate: updatedAssignment.dueDate,
                   
                   
                }
            }
          
            const result = await assignmentCollection.updateOne(filter, products, options);
            res.send(result);
          })


          app.delete('/assignment/:id', async (req, res) => {
            try{
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const result = await assignmentCollection.deleteOne(query);
                res.send(result);
            } catch(error)
            {
                console.log(error)
            }
              
          })
          




        //   submit

        app.get("/submit", async (req, res) => {
            const result = await submitCollection.find().toArray();
            console.log(result);
            res.send(result);
          });
      

        app.post("/submit", async (req, res) => {
            try {
                const body = req.body;
                const result = await submitCollection.insertOne(body);
                console.log(result);
                res.send(result);

                
            } catch (error) {
                console.log(error);

            }

        });

        app.put('/submit/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedSubmit = req.body;
          
            const products = {
                $set: {
          
         
                
                    marks: updatedSubmit.marks,
                    feedback: updatedSubmit.feedback,
                    status: updatedSubmit.status,
                   
                   
                   
                }
            }
          
            const result = await submitCollection.updateOne(filter, products, options);
            res.send(result);
          })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!!!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Crud is running .....");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
