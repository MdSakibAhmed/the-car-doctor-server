
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
// Midlware
app.use(cors())
app.use(express.json())
require("dotenv").config()

const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkhrl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




















const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db(process.env.DB_NAME).collection('services');
  const adminCollection = client.db(process.env.DB_NAME).collection('admin-list');
  const orderCollection = client.db(process.env.DB_NAME).collection('orders')
  const reviewCollection = client.db(process.env.DB_NAME).collection('reviews')

  // add service
  app.post('/addService',(req,res)=> {
      const service = req.body;
      console.log(service);
      serviceCollection.insertOne(service).then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
      })
  })

// get all services
app.get('/services',(req,res) => {
    serviceCollection.find({}).toArray((err,documents) => {
        
        res.send(documents)
    })
})

// Delete service


app.delete('/deleteService/:id',(req,res) => {
    const id = req.params.id;
    console.log( typeof  id);
    serviceCollection.deleteOne({_id:objectId(id)}).then(result => {
        console.log(result);
        res.send(result.deletedCount > 0)
    })
})

// get single service
app.get('/service/:id',(req,res) => {
    const id = req.params.id
    serviceCollection.findOne({_id:objectId(id)}).then(result => {
        res.send(result)
        console.log(result);
    })
})


// add Admin
app.post('/addAdmin',(req,res) => {
    const email= req.body
    console.log(email);
    adminCollection.insertOne(email).then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
    })
})



// add order

app.post('/addOrder',(req,res) => {
    const order = req.body
    orderCollection.insertOne(order).then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
    })
})

// get all orders

app.get('/orders',(req,res) => {

    const email = req.query.email;
adminCollection.find({email:email}).toArray((err,documents)=> {
    const filter = {}
    if(!documents.length){
        filter.email = email

    }

    orderCollection.find(filter).toArray((err,orders) => {
        res.send(orders)
    })
})
   
})

// update order status
app.patch('/updateStatus/:id',(req,res) => {
    const id = req.params.id
    const status = req.body.status;
    console.log(id,status);
    orderCollection.updateOne({_id:objectId(id)},{
        $set:{status:status}
    }).then(result => {
        console.log(result);
        res.send(result.modifiedCount > 0)
    })
})

// is Admin?
app.post('/isAdmin',(req,res) => {
    const email = req.body.email;
    adminCollection.find({email:email}).toArray((err,documents) => {
        console.log("admin" + documents);
        res.send(documents.length > 0)
    })
})

// send Customer reviews
app.post('/addReview',(req,res) => {
    reviewCollection.insertOne(req.body).then(result => {
        console.log('review'+ result);
        res.send(result.insertedCount > 0)
    })
})

// get Customer Reviews
app.get('/reviews',(req,res) => {
    reviewCollection.find({}).toArray((err,documents) => {
        console.log(documents);
        res.send(documents)
    })
})






  // perform actions on the collection object
  console.log(err);

});

app.get('/test',(req,res) => {
    res.send('hello world')
})

app.listen(port)
