
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;


// middele were
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o15tjkl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{ 

  
        const serviceCollection =client.db('traveldb').collection('services');
        const reviewCollection = client.db('traveldb').collection('reviews');

        app.get('/service', async(req,res)=>{
          const  query = {}
          const cursor = serviceCollection.find(query);
          const result = await cursor.limit(3).toArray();

            res.send(result)
    })


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


app.post('/reviews', async (req,res)=>{

     const review = req.body;
     const result = await reviewCollection.insertOne(review)
     res.send(result)
})



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



app.post('/services', async(req,res)=>{
        
  const service = req.body;
  const result = await serviceCollection.insertOne(service)
  
 res.send(result)

})



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
