
const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;


// middele were use
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o15tjkl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 
// jwt veify for use

function verifyToken(req,res,next){

   const headered = req.headers.authoriztion;
   if(!headered){
       return res.status(401).send({message:'unauthoriztion access'})
   }

   const token = headered.split(' ')[1]

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error,decoded){
    if(error){
      return res.status(401).send({message:'unauthoriztion access'})
    }
    req.decoded = decoded
    next()
   })
}







async function run(){

    try{ 

  
        const serviceCollection =client.db('traveldb').collection('services');
        const reviewCollection = client.db('traveldb').collection('reviews');

        app.post('/jwt',(req,res)=>{
          const persons = req.body;
          const token = jwt.sign(persons, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'7d'})
 
             res.send({token})
 
           })


       // get condition  data service Api

        app.get('/service', async(req,res)=>{
          const  query = {}
          const cursor = serviceCollection.find(query);
          const result = await cursor.limit(3).toArray();

            res.send(result)
    })

  // get service Api
 
        app.get('/services', async(req,res)=>{
          const  query = {}
          const cursor = serviceCollection.find(query);
          const result = await cursor.toArray();
        
            res.send(result)
    })


    app.get('/services/:id', async(req,res)=>{
         
      const id = req.params.id;
      const  query = {_id :new ObjectId(id)};
      const result = await serviceCollection.findOne(query);

        res.send(result);
})

// post reviews Api
app.post('/reviews', async (req,res)=>{

     const review = req.body;
     const result = await reviewCollection.insertOne(review)
     res.send(result)
})


// get reviews Api

app.get('/reviews',  async(req,res)=>{ 
            
  let query = {} ;

  if(req.query.email){

  query = {
    email:req.query.email
    }
  }
     const cursor = reviewCollection.find(query);
    const result = await cursor.toArray();
    res.send(result)
  })


// post service Api

app.post('/services', async(req,res)=>{
        
  const service = req.body;
  const result = await serviceCollection.insertOne(service)
  
 res.send(result)

})
 
//  Reviews  Api delete method use

 app.delete('/reviews/:id', async (req,res)=>{
   
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
 })


 



    }


    finally{


    }


}

run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('Travel server site running ...')
})


   app.listen(port,()=>{

    console.log(`Travel server runnings ${port}`)
})
