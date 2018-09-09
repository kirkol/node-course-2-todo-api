const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
  if(err){
    console.log('Unable to connect to MongoDB server')
  }else{
     console.log('Connected to MongoDB server')
     const db = client.db('TodoApp')
    //  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //   console.log('Todos')
    //   console.log(JSON.stringify(docs, undefined, 2))
    //  }, (err) => {
    //    console.log('Ubable to fetch todos', err)
    //  })

     db.collection('Todos').find().count().then((count) => {
      console.log(`Todos count: ${count}`)
     }, (err) => {
       console.log('Ubable to fetch todos', err)
     })
  }
  //UWAGA: linia ponizej zostala zakomentowana, poniewaz mialaby wplyw
  //na dzialanie programu! Zanim Promise zwrocilby wynik, to baza zostalaby
  //zamknieta i amen ;)
  //client.close()
})