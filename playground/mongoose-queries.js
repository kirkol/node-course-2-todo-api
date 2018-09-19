const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

const id = '5ba0f429c01f7b19248abe03'

//Walidacja - czy ID jest w ogole poprawne (nie ma spacji, nie jest za dlugie, krotkie, itp.)
if(!ObjectID.isValid(id)){
  console.log('ID not valid')
}

//sprawdzamy czy jest okreslony ID w kolekcji 

// //zwraca array dokumentow
// Todo.find({
//   _id: id // tutaj nie musimy konwertowac tego stringa do obiektu typu ID, bo obsluguje to mongoose
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// //jw. ale zwraca tylko jeden dokument (wiersz), ktory pasuje do warunku
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })

//jak w nazwie xD
Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found')
  }
  console.log('Todo by Id', todo)
}).catch((e) => console.log(e))