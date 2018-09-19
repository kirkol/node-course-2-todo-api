// ten plik odpowiada tylko za routing! :) 
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()

//ustawienie middleware'a
//przy kazdym routingu bedzie wywolywac sie funkcja bodyParser.json()
app.use(bodyParser.json())

//funkcja post wysyla request pod wskazany URL (tu: /todos)
//a nastepnie wywolywany jest callback (w razie powodzenia lub nie)
app.post('/todos', (req, res) => {
  // tworzy obiekt za pomoca modelu (wzorca ;))
  // pobiera pole text z body z requesta usera
  const todo = new Todo({
    text: req.body.text
  })
  // zapisuje dokument (wiersz) do bazy
  // w przypadku powodzenia wysyla dokument z powrotem do usera
  // (mozna go wtedy wyswietlic userowi, np. "zapisales <dane z dokumentu> do bazy")
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e) // w razie 'w' odsylamy error userowi (zeby mogl go sobie wyswietlic)
  })
})

//routing dla adresu '/todos', ale dla metody GET
//pobierze wszystkie dokumenty (wiersze) kolekcji (tabeli) todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e)
  })
})

//POBRANIE WARTOSCI ADRESU Z ID
//GET /todos/12345    <- pobranie 12345
app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) { // najpierw walidacja (czy id w ogole jest OK)
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

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {
  app
}