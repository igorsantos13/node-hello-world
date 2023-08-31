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