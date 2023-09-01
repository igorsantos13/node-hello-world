const express = require('express');
const mongoose = require('mongoose')
const Customer = require('./models/customer')
const app = express();

mongoose.set('strictQuery', false);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()

}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const customer = new Customer({
    name: 'Cleito',
    industry: 'Music'
});

//sends to home page a message
app.get('/', (req, res)=>{
    res.send(customer)
})

//post and print the data back
app.get('/api/customers', async (req, res) => {
    try{
        const result = await Customer.find(); //grabs all the data
        res.json({"customers": result})
        res.status(200)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})


app.get('/api/customers/:id', async (req, res) => {
    try{
        const {id: customerID} = req.params; //get users ID;
        const customer = await Customer.findById(customerID);

        if(!customer){
            res.status(404).json({error: 'User not found'})
        }else{
            res.json({customer})
        }

    }catch(err){
        res.status(500).json({error: 'it is broken :('})
    }
})

app.put('/api/customers/:id', async (req, res) => {
    try{
        const customerID = req.params.id
        const result = await Customer.replaceOne({_id: customerID}, req.body)
        res.json({updateCount: result.modifiedCount})
    }catch(err){
        res.status(500).json({error: 'something went wrong =('})
    }
})

app.delete('/api/customers/:id', async(req,res) => {
    try{
        const customerID = req.params.id
        const result = await Customer.deleteOne({_id: customerID})
        res.json({deletedCount: result.deletedCount})
    }catch(err){
        res.status(500).json({error: "something went wrong..."})
    }
})

//make a post request to homepage, as response we have a message
app.post('/api/customers', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

const start = async() => {
    
    try{
        await mongoose.connect(CONNECTION)
        
        //listen to a port
        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT)
        })
    }catch(err){
        console.log(err.message)
    }
    
}

start()