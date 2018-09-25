require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const listener = () => console.log(`Listening to port ${port}!`)

mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true })
const teamSchema = new mongoose.Schema({
    first: String,
    last: String,
    age: Number
})
const Team = mongoose.model("Team", teamSchema)

// app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(cors())
app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error('Bad JSON');
    }
  });

app.get('/', (req,res) => {
    console.log('PONG')
    Team.find({})
    .then(team => res.json({team}))
})

app.post('/', (req,res,next) =>{
    Team.create(req.body)
    .then(team => res.status(201).json({team})).pretty()
    next(err)
})

app.put('/:id', (req,res) => {
    console.log(req.params.id,req.body)
    Team.update({_id:req.params.id},{$set : req.body})
    .then(team => res.status(201).json({team}))
    // next(err)
})

// Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({error:err})
})
app.use((req,res,next)=>{
    res.status(404).json({error: {message: 'Not Found!'}})
})
app.listen(port,listener)



