
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = "mongodb+srv://abeydhasan134:OMic7lcw0efFrRd9@cluster0.il352b3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const corsOptions ={
  origin:["http://localhost:5173","https://our-pottery.web.app","http://localhost:5000"], 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Pottery is available");
});

async function run() {
  try {
    const database = client.db("potteryWeb");
    const craftCollection = database.collection("craftdata");
    
    const crafters=database.collection("ourartice");
    const blogs=database.collection("blogs")

    app.get("/blogs",async(req,res)=>{
      const cursor = blogs.find();
      const result = await cursor.toArray();
      res.send(result);
      // console.log(result);
    })

    app.get("/artices",async(req,res)=>{
      const cursor = crafters.find();
      const result = await cursor.toArray();
      res.send(result);
      // console.log(result);
    })

    // manual data from database
    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/crafts", async (req, res) => {
      const newItem = req.body;
      const result = await craftCollection.insertOne(newItem);
      res.send(result);
    });
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("deleted id from server", id);
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/Crafts/:id", async (req, res) => {
      const id = req.params.id;
      const updatecraft = req.body;
      // console.log(updatecraft.image,
      //   updatecraft.item_name,
      //   updatecraft.subcategory_name,
      //   updatecraft.short_description,
      //   updatecraft.price,
      //   updatecraft.rating,
      //   updatecraft.customization,
      //   updatecraft.processing_time,
      //   updatecraft.stock_status,
      //   updatecraft.user_email,
      //   updatecraft.user_name,
      // );
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: updatecraft.image,
          item_name: updatecraft.item_name,
          subcategory_name: updatecraft.subcategory_name,
          short_description: updatecraft.short_description,
          price: updatecraft.price,
          rating: updatecraft.rating,
          customization: updatecraft.customization,
          processing_time: updatecraft.processing_time,
          stock_status: updatecraft.stock_status,
          user_email: updatecraft.user_email,
          user_name: updatecraft.user_name,
        },
      };
      
      const result = await craftCollection.updateOne(filter, updateDoc,options);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
