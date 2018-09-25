const env = process.env.NODE_ENV || 'development'

//pobranie konfiguracji z pliku config, ktory zapewnia ustawienia dla
//srodowiska deweloperskiego i testowego
//ten plik NIE MOZE byc czescia repo na GitHubie (leci do .gitignore)
if(env === 'development' || env === 'test'){
  const config = require('./config.json')
  const envConfig = config[env]

  //pobranie odpowiednich wartosci PORTow i MONGODB_URI z config.json ;)
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}