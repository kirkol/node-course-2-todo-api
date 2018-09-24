const {User} = require('./../models/user')

//to middleware uzywany do autoryzacji requestow usera
const authenticate = (req, res, next) => {
  //w requescie wysylamy naszego tokena, zeby serwer nas wpuscil ;)
  const token = req.header('x-auth')

  //funkcja, ktora znajduje usera za pomoca jego tokena i pozwala (lub nie) na wyswietlenie routa
  //UWAGA: to nasza wlasna funkcja (dolaczona do User schema :))
  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject()
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send() // 401 to nieprawidlowa autoryzacja ;)
  })
}

module.exports = {authenticate}