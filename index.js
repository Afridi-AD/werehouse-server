const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId =require('mongodb').ObjectId;
const res = require('express/lib/response');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;



// use middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qylyk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('cycle-kids').collection('products');
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/products/:id', async(req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        app.post('/products', async (req,res)=>{
            const newProduct =req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)

        });

        app.delete('/products/:id', async(req,res)=>{
          const id  = req.params.id;
          console.log(id);
          const query ={_id:ObjectId(id)};
          const result =await productCollection.deleteOne(query);
          res.send(result);

        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('run aro run run')
});


app.get('/product', (req, res) => {
    res.send('simple api')
});



app.listen(port, () => {
    console.log('run server', port);
});