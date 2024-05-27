 const express = require('express');
 require('dotenv').config();
 const app = express();
 const cors = require('cors');
 const port = process.env.PORT || 5000;

 //middleware
 app.use(cors());
 app.use(express.json())

console.log(process.env.DB_USER)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kv4807a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const menuCollection = client.db('Bistro_Boss').collection('menu');
    const cartsCollection = client.db('Bistro_Boss').collection('carts');
    const reviwesCollection = client.db('Bistro_Boss').collection('reviwes');
    const usersCollection = client.db('Bistro_Boss').collection('users');


    // user releated api
    app.post ('/users', async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.get('/menu', async(req,res)=>{
      const result = await menuCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/reviews', async(req, res)=>{
      const result = await reviwesCollection.find().toArray();
      res.send(result);
    })

    // Carts collection 
    app.post('/carts', async(req, res)=>{
      const carts = req.body;
      const result = await cartsCollection.insertOne(carts);
      res.send(result);
    })

    app.get('/carts', async(req, res)=>{
      const result = await cartsCollection.find().toArray();
      res.send(result);
    })


    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result)
    })



    await client.connect();
    // Send a ping to confirm a successful connection
   //  await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);


 app.get('/', (req, res)=>{
   res.send('Hello from my node server')
 })

 app.listen(port, ()=>{
   console.log(`Server is running on port ${port}`)
 })