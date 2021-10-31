const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require("dotenv").config()
const cors = require('cors');
const port = process.env.PORT || 5000;


//MIDDLE WARE
app.use(express.json())
app.use(cors())

//MongoDB Connect
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fpc6f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        client.connect()
        const database = client.db('travexion')
        const destinationsCollection = database.collection('destinationCollections');
        const ordersCollection = database.collection('orders')

        //GET DESTINATIONS - API
        app.get('/destinations', async (req, res) => {

            const cursor = destinationsCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations)

        });

        //GET SINGLE DESTINATIONS - API
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const destination = await destinationsCollection.findOne(query);

            res.send(destination)
        })

        //POST DESTINATION - API 
        app.post('/destinations', async (req, res) => {
            const destination = req.body;
            const result = await destinationsCollection.insertOne(destination)
        })

        //GET ORDERS - API 
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray();

            res.send(orders)
        })

        //POST ORDERS - API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
        })

        //GET USER ORDER - API
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = ordersCollection.find({ email: email });
            const orders = await query.toArray()

            res.send(orders)
        })

        //DELETE USER ORDER - API
        app.delete('/orders/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        //UPDATE ORDER STATUS - API
        app.get('/orders/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: { status: 'Approved' }
            }
            const result = await ordersCollection.updateOne(query, updateDoc);
            res.json(result)
        })
    }
    finally {
        //await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Tavixion server is running")
})

app.listen(port, () => {
    console.log('Listening to the port:', port)
})