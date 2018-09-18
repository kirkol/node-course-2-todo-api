// ten plik odpowiada tylko za routing! :) 
const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

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

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {
  app
}