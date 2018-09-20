require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()

// zmienna bedzie automatycznie ustawiona przez Heroku lub domyslnie bedzie port 3000
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  
  const todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e) 
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) { 
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.status(200).send({ todo })
  }).catch((e) => {
    return res.status(400).send()
  })
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  Todo.findOneAndDelete({_id: id}).then((todo) => {
    if(!todo){
      return res.status(404).send()
    }
    res.status(200).send({todo})
  }).catch((e) => {
    return res.status(400).send()
  })
})

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id

  //funkcja pick() z obiektu, np. {a:1, text:"aaa", completed:"yes", bbb:3}
  //tworzy obiekt jedynie z wlasnosciami wskazanymi w arrayu z drugiego argumentu
  //czyli tu: {text:"aaa", completed:"yes"}
  const body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime()
  }else{
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })

})

//TUTAJ ZAMIAST 3000 JEST PORT!!!
app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = {
  app
}