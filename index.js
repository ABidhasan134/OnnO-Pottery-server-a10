// G6W48amYUcKS9Wcx
// Potteryweb
// OMic7lcw0efFrRd9
// abeydhasan1
const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const uri = "mongodb+srv://abeydhasan134:OMic7lcw0efFrRd9@cluster0.il352b3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

app.get("/",(req,res)=>{
    res.send("Pottery is available")
})

async function run() {
    try {
     
      const database = client.db("potteryWeb");
      const craftCollection = database.collection("craftdata");
      const newCollection= database.collection("newcraftdata");

      app.post("/newCraft",async(req,res)=>{
        const newItem=req.body;
        console.log(newItem);
        const result=await newCollection.insertOne(newItem)
        res.send(result);
      })
      // manual data from database
      app.get("/crafts", async(req,res)=>{
 
        const cursor=craftCollection.find();
        const result=await cursor.toArray();
        res.send(result);
      })
  
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
  
app.listen(port,()=>{
    console.log(`Running on ${port}`)
});