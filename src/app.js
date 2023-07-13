const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const PORT = 3000;

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

//listen to a port
app.listen(PORT, () => {
    console.log('App listening on port ' + PORT)
})