// uzycie sterownika do Mongo
//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

const obj = new ObjectID()

console.log(obj)



//tworzy polaczenie z baza danych
//.connect() jako argument przyjmuje stringa z lokalizacja naszej bazy
//moze byc to adres URL na ktorej wisi baza
//jakis Amazon (AWS) URL lub Heroku URL
//lub localhost
//drugi RGUMENT 'BO TAK' :D
//trzecim argumentem jest callback - funkcja, ktora ma sie wywolac, gdy
//udalo sie lub NIE nawiazac polaczenie z baza
MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
  if(err){
    console.log('Unable to connect to MongoDB server')
  }else{
     console.log('Connected to MongoDB server')
    // // odwolanie sie do konkretnej bazki
     const db = client.db('TodoApp')
    // // dodaje do kolekcji (tabeli) 'Todos' nowy dokument (wiersz) z polami (~kolumnami) text i completed
    // // jesli taka kolekcja nie istnieje, to zostanie automatycznie utworzona
    // db.collection('Todos').insertOne({
    //   text: 'Something to do',
    //   completed: false
    // }, (err, result) => {
    //   if(err){
    //     console.log('Unable to insert todo', err)
    //   }else{
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    //   }
    // })
    // db.collection('Users').insertOne({
    //   name: 'Kuba',
    //   age: 29,
    //   location: 'Wroclaw'
    // }, (err, result) => {
    //   if(err){
    //     console.log('Unable to insert user', err)
    //   }else{
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
    //   }
    // })
  }
  client.close()
})