const {SHA256} = require('crypto-js') //funkcja hashujaca (szyfrujaca)
const jwt = require('jsonwebtoken') // biblioteka hashujaca i saltujaca - patrz tlumaczenie wyzej ;)
const bcrypt = require('bcryptjs') // biblioteka hashujaca i saltujaca (jw. ale inna ;))

const password = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})

const hashedPassword = '$2a$10$P7Q9cFR.8WjOUiSKtYeBruNbtMNqgpT7zUYjZzOf8z1C8YbUeIjSu'

//porownanie czy password = temu zahashowanemu przez bcryptjs
//res to true/false :)
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})













//PRZYKLAD JWT

// const data = {
//   id: 10
// }


// // podpisuje, czyli tworzy hasha dla danych wysylanych userowi (z jego id)
// // drugim argumentem jest nasz secretstring (dla saltingu)
// // ten token (obiekt z data i hashem) wysylamy userowi, gdy ten sie zaloguje
// // kazdy kolejny request od usera bedzie szedl z tym tokenem, zeby bylo wiadomo, ze on to on ;)
// // ten token bedzie tez przechowywany w naszej bazie dla kazdgeo usera
// const token = jwt.sign(data, '123abc')

// // funkcja sprawdzajaca czy token przyslany z requestem usera nie zostal podmieniony
// // jako argument przyjmuje ten sam secretstring - dzieki temu sprawdza czy wszystko sie zgadza
// // czy nic nie zostalo podmienione
// // jesli cos nie halo, to funkcja ponizej zwroci nam blad, ktory mozemy sobie obsluzyc, jesli chcemy ;)
// const decoded = jwt.verify(token, '123abc')


//PRZYKLAD HASHINGU I SALTINGU (BEZ BIBLIOTEK)

// const message = 'I am user number 3'
// const hash = SHA256(message).toString() //zaszyfrowanie message i konwesja do Stringa


// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// // to dane, ktore bedziemy chcieli odeslac klientowi, ALE tu sa gołe dane
// // takich nie mozemy wyslac, bo sa latwe do edycji! Dlatego najpierw musimy je zahashowac
// // tak, zeby klient nie mogl znalezc sobie tych danych i zmienic id z 4 na 3
// const data = { 
//   //to id = id usera, pozwala nam stwierdzic, ktory user mozne zrobic taki request
//   //np. jesli user 4 moze zrobic request DELETE /postyUsera4, to nie moze tego zrobic
//   //user 3
//   id: 4 
// }

// // TO ZWRACAMY KLIENTOWI!!!
// // to dane z obiektu wyzej, ale zahashowane
// // to obiekt, ktory zawiera jawne dane (z gory) oraz czesc zahashowana
// // czesc zahashowana to dokladnie te same dane, ale przemielone przez funkcje hashujaca
// // WAZNE: jesli user przechwyci ten token i zmieni w nim dane z pierwszej wlasciwosci,
// // to nie pokryja sie one z druga i dzieki temu bedzie wiadomo, ze cos jest nie halo (serwer odrzuci klienta)
// // UWAGA: Sprytny klient po przechwyceniu tokena sprobowdzilby sobie jaka funkcja hashujaca jest uzywana
// // tzn. wartosc w "data" przepuscilby przez popularne funkcje hashujace i gdy ktoras zwrocilaby mu hash
// // odpowiadajacy temu, ktory jest w obiekcie, to reszta bylaby prosta. Wystarczy podmienic w data id=4 na id=3
// // pozniej przepuscic to przez odpowiednia funkcje hashujaca i wartosc wrzucic we wlasnosc hash i odeslac na serwer
// // serwer przyjmie takiego requesta i potraktuje go jako requesta od usera nr 3! 
// // Zeby takie akcje nie mialy miejsca, najprostszym rozwiazaniem (zamiast dodawac druga funkcje hashujaca
// // - patrz TLDR nizej) dodaje sie do wartosci data kilka liter (jakis staly string) i dopiero to sie zahashowuje ;)
// // to nazywa sie SALTINGIEM HASHA!
// // Dzieki temu mimo re-hashingu hacker nigdy nie dostanie dokladnie tego samego co jest w "data". To az tak super nie
// // jest, ale mocno utrudnia hacking ;)
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecretstring').toString()
// }

// //resultHash, to ten, ktory dostajemy od klienta w jego requestach
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecretstring').toString()

// //sprawdzamy, czy jeden jest rowny drugiemu (czy ktos nie podmienil hasha, zeby nas shackowac)
// if(resultHash === token.hash) {
//   console.log('Data was not changed. It is OK :)')
// }else{
//   console.log('Data was changes. Do not trust it!')
// }
