const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

// Usuwanie dokumentow (wierszy) za pomoca Mongoose

// Usuwanie wielu dokumentow
// przekazanie pustego obiektu, sprawia, ze wszystkie dokumenty spelniaja taki warunek,
// wiec wszystko zostanie usuniete z bazy ;)
 Todo.deleteMany({}).then((result) => {
  console.log(result)
 })

// Usuwanie pojedynczego dokumentu ;) Jesli jest wiele dokumentow
// spelniajacych nasz warunek, to pierwszy z nich zostanie usuniety
 Todo.deleteOne({text: "aaaa"}).then((result) => {
   console.log(result)
 })

 //Usuwanie pojedynczego dokumentu po Id
 //funkcja usuwa ten dokument, a nastepnie usuwa go z bazy
Todo.findOneAndDelete('5ba361a5c5afb9880b137b06').then((doc) => {
  console.log(doc)
})