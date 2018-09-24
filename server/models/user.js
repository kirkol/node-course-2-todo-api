const mongoose = require('mongoose')
const validator = require('validator') // modul do walidowania wartosci pól
const jwt = require('jsonwebtoken')
const _ = require('lodash')

//Schema przechowuje wszystkie wlasnosci modelu (schemat)
//Mozna to zrobic bezposrednio w samym modelu (przekazujac obiekt opisany w Schema do modelu)
//Ale schema pozwala na dodanie metod do schemy (moze byc tez przydatny do uzycia tej samej shcemy
//dla wielu modeli ;))
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, // ustawienie, ze to pole ma byc niepowtarzalne
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

//obiekt ponizej przechowuje wszystkie metody UserSchema, za jego pomoca
//mozna dodac jakies nowe metody dla UserSchema :)
//tu: dodajemy metode 'generateAuthToken'
UserSchema.methods.generateAuthToken = function () {
  // tu this odnosi sie do instancji (do pojedynczego obiektu usera, NIE ogolnie do modelu/schemy)
  // dzieki temu mamy dostep do pojedynczego dokumentu usera
  const user = this
  const access = 'auth'
  //tworzymy token - w obiekcie z pierwszego argumentu przekazujemy pole, ktore bedzie wykorzystywane
  //do autoryzacji naszego usera - najprosciej: jego id :D
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc12345').toString()

  user.tokens = user.tokens.concat([{access, token}])

  return user.save().then(() => {
    return token
  })
}

//tutaj uzywamy UserSchema, zeby nadpisac metode. Domyslnie metoda ta zwraca caly obiekt JSON,
//tj. wszystko nt. naszego usera, a nie wolno zwracac nam passworda i ciagu tokenow
//wiec nadpisujemy te metode ;)
//tu: przy zmianie w JSONa ustawiamy, ze NIE wszystko ma byc konwertowane do JSONa, tylko wybrane
//wlasnosci obiektu :) 
UserSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

const User = mongoose.model('User', UserSchema)

module.exports = { User }

