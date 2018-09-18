const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

//przygotowuje nasza baze do testow
//UWAGA: usuwa najpierw wszystkie zapisane w niej rekordy!
//a nastepnie ruszaja testy
beforeEach((done) => {
  Todo.deleteMany({}).then(() => done())
})

describe('POST /todos', () => {
  // test sprawdzajacy czy jesli wyslemy request metoda POST do bazy
  // ktory w polu text bedzie mial 'Test todo text'
  // to serwer zwroci status = 200
  // a w odpowiedzi z serwera (res.body.text) bedzie nasz wprowadzony text
  // poza tym sprawdzane jest tez, czy w bazie pojawil sie nowy dokument (wiersz)
  // UWAGA: sprawdzane jest to na bazie, ktora jest czysta, tj. nie ma zadnych dokumentow
  // bo najpierw dziala funkcja beforeEach(), ktora czysci cala baze
  // dzieki temu mozna sprawdzic warunek, czy kolekcja (tabela) ma teraz 1 dokument (wiersz)
  // sprawdzane jest tez czy pierwszy dokument zawiera nasz text
  it('should create a new todo', (done) => {
    const text = 'Test todo text'

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text)
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(1)
        expect(todos[0].text).toBe(text)
        done()
      }).catch((e) => done(e))
    })
  })
  // test sprawdzajacy czy jesli wyslemy do bazy pusty (nieprawidlowy) dokument (wiersz)
  // to serwer powinien zwrocic nam status 400, do bazy nic nie powinno sie zapisac
  // (bo pusty obiekt jest niezgodny z modelem todo), wiec kolekcja (tabela)
  // powinna miec 0 elementow
  it('Should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err) {
        return done(err)
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(0)
        done()
      }).catch((e) => done(e))
    })
  })
})