const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server')
  } else {
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    //update dokumentu o ID = (patrz nr ponizej xD)
    //zeby updatowac trzeba uzyc jednego z operatorow (tu: set)
    //operatorow updatujacych jest wiecej i sa calkiem fajne (np. inkrementujace pole)
    //returnOriginal ustawilismy na false, bo domyslnie jest true
    //inaczej funkcja zwrocilaby nam tez oryginalna wartosc dokumentu, a tego nie potrzebujemy
    db.collection('Todos').findOneAndUpdate({
      _id: new ObjectID('5b957036d7a1cf7a3a309744')
    }, {
      $set: {
        completed: true
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result)
    })

  }
  //client.close()
})