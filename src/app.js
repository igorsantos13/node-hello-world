const express = require('express');
const mongoose = require('mongoose')
const app = express();

mongoose.set('strictQuery', false);
app.use(express.json())
app.use(express.urlencoded({extended: true}))

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()

}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

//sends to home page a message
app.get('/', (req, res)=>{
    res.send('Hello express!')
})

//post and print the data back
app.post('/api/driverData', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

//make a post request to homepage, as response we have a message
app.post('/', (req, res) => {
    res.send('This is a post request!')
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