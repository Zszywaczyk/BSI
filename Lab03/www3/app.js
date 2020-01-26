//REST
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
var integer = { value: 34 }

var https = require('https')
var fs = require('fs')
var path = require('path')

var passport = require('passport')
var passportjwt = require('passport-jwt')
var passporthttp = require('passport-http')

app.use(express.json())
app.use(express.urlencoded({ extended: true, }))

var users  = [
  {
    id: 0,
    login: "admin",
    password: "a1d2m3i4n5"
  },
  {
    id: 1,
    login: "tomek",
    password: "razdwa3"
  },
  {
    id: 2,
    login: "itsme",
    password: "lol666"
  },
  {
    id: 3,
    login: "hakerman",
    password: "hellomyfriend"
  }
]


//pozwalamy tylko strona z whitelist
var whitelist = ['https://chowrat.org', 'https://chowrat.org/', 'https://chowrat.org/rest', 'https://chowrat.org/rest/https://chowrat.net/','chowrat.org','fd'];
var corsOptions = {
  origin: function (origin, callback) {
    //console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS \n'+origin))
    }
  },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
}

passport.use(new passporthttp.BasicStrategy( (login, password, done) => {
  users.find((element, index, array)=>{
    if(element.login===login){
      if(element.password===password){
        done(null, array)
      }
      else{
        done(null, false)
      }
    }
    if(index+1==users.length){
      done(null, false)
    }
  })
}))

app.use(cors(corsOptions));
/*app.use(cors({
  origin: 'https://chowrato.com'
}))*/

//reczne ustawianie naglowka pozwalajacego
app.all('/*', function(req, res, next) {
    //res.header('Access-Control-Allow-Origin', 'dsafds.com');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    
    //var log = req.headers.referer;
    
    //console.log(req);
  
    
    //console.log('cos ' +JSON.stringify(req.headers.origin) );

    //console.log('cos '+req.headers);
  
    next();
  });

app.get('/', (req, res) => {
    res.json( integer)
    
})

app.post('/', (req, res) => {
    //console.log(req.body.value)
    integer = req.body
    res.json(integer)
    res.status(200);
})

https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'sec/chowrat.net.key')),
  cert: fs.readFileSync(path.join(__dirname, 'sec/chowrat.net.crt'))
}, app).listen( port, function(){
  console.log(`Example app listening on port ${port}!`)
} )


//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
