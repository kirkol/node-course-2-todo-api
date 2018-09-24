const mongoose = require('mongoose')
const validator = require('validator') // modul do walidowania wartosci pól
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

UserSchema.methods.removeToken = function(token) {
  const user = this
  return user.update({
    //$pull to funkcja mongoose, ktora pozwala na wyrzucenie czegos z ciagu, jesli jest spelniony warunek
    //tu: jesli jest taki token, to zostanie usuniety z ciagu tokenow przypisanych do usera ;)
    $pull: {
      tokens: { token }
    }
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

//statics jest jak methods. Methods zwraca metody dostepne dla instancji, natomiast
//statics zwraca metody dostepne dla calego modelu/schemy ;)
UserSchema.statics.findByToken = function(token) {
  //tutaj this dotyczy calego modelu, wiec 
  const User = this
  let decoded = ''

  //try/catch, bo funkcja jwt.verify zwroci error, gdy token nie bedzie prawidlowy
  //tj. ktos po stronie usera grzebal przy nim i warto wychwycic takie adresy z 
  try{
    decoded = jwt.verify(token, 'abc12345')
  }catch(e){
    return Promise.reject()
  }
  //jesli funkcja verify sie powiedzie, to szukamy usera za pomoca tokena i juz wiemy kto to :)
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

//przy logowaniu sprawdzenie czy user w ogole istenieje w naszej bazie
UserSchema.statics.findByCredentials = function(email, password){
  const User = this
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user)
        }else{
          reject()
        }
      })
    })
  })
}

//uzycie middleware'a mongoose (cos a'la trigger before insert/update)
//tu: before save (czyli zanim cos zapiszemy (zainsertujemy) w naszej bazie)
UserSchema.pre('save', function(next){
  const user = this
  //isModified sprawdza czy password jest modyfikowany
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  }else{
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }

