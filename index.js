const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require ('cors')
const { MongoClient } = require('mongodb');

require('dotenv').config()
const port = 5000

app.use(bodyParser.json());
app.use(cors ()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jayfm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const productCollection = client.db("emajon").collection("product-list");

  app.post('/addProduct', (req, res) =>{

      const products = req.body;
      productCollection.insertMany(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })

  app.get('/product', (req, res) => {
    productCollection.find({})
    .toArray(
      (err, document) =>{
        res.send(document)
      }
    )

  })

  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
    .toArray(
      (err, document) =>{
        res.send(document[0])
      }
    )

  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

});











app.listen(port)