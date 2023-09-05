const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const Customer = require('./models/customer')
const app = express();

mongoose.set('strictQuery', false);

app.use(cors());
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

//good to replace the entire resource - copies entire data and sends back everythihng
app.put('/api/customers/:id', async (req, res) => {
    try{
        const customerID = req.params.id
        const customer = await Customer.findOneAndReplace({_id: customerID}, req.body, {new: true})
        res.json({customer})
    }catch(err){
        res.status(500).json({error: 'something went wrong =('})
    }
})

//good to change few lines and resends back to API only what was changed
app.patch('/api/customers/:id', async (req, res) => {
    try{
        const customerID = req.params.id;
        const customer = await Customer.findOneAndUpdate({_id: customerID}, req.body, {new: true});
        console.log(customer)
        res.json({customer})
    }catch(err){
        res.json({error: err.messsage})
    }
})

//update nested data
app.patch('/api/orders/:id', async (req, res) => {
    const orderID = req.params.id;
    req.body._id = orderID;
    try {
        const result = await Customer.findOneAndUpdate(
            { 'orders._id': orderID },
            { $set: { 'orders.$': req.body } },
            { new: true }
        );
            console.log(result)
            console.log(req.body)
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.get('/api/orders/:id', async (req, res) => {
    try{
        const {id: orderID} = req.params; //get users ID;
        const order = await Customer.findOne({'orders._id': orderID});

        if(!order){
            res.status(404).json({error: 'User not found'})
        }else{
            res.json(order)
        }

    }catch(err){
        res.status(500).json({error: 'it is broken :('})
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

//add a new customer to DB
app.post('/api/customers', async(req, res) => {
    const customer = new Customer(req.body);
    console.log(req.body)
    try{
        await customer.save();
        res.status(201).json({customer})
    }catch(err){
        res.status(400).json({error: err.message})
    }
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