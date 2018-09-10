const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server')
  } else {
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // deleteMany
    //usuwa wiele dokumentow, ktore spelniaja jakis nasz ustawiony warunek
    //tu: gdy pole text = 'Eat lunch'
    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
      console.log(result)
    })
    //usuwa jeden dokument, ktory spelnia jakis warunek
    // deleteOne
    db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
      console.log(result)
    })
    // findOneAndDelete
    // podobnie jak funkcja wyzej - pozwala na skasowanie jednego obiektu, ktory spelnia
    // jakis warunek, ALE pozwala w razie 'w' na przywrocenie tego
    // dokumentu z powrotem! I to jest spoko ;)
    // po wywolaniu zwraca ten dokument i jesli potrzeba, to mozemy go przechowac
    // i go dopisac do bazy znowu
    db.collection('Todos').findOneAndDelete({complete: false}).then((result) => {
      console.log(result)
    })

  }
  //client.close()
})