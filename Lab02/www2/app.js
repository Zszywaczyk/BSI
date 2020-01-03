//REST
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
var integer = { value: 34 }

var https = require('https')
var fs = require('fs')
var path = require('path')

app.use(express.json())
app.use(express.urlencoded({ extended: true, }))


//pozwalamy tylko strona z whitelist
var whitelist = 'https://chowrat.org/'
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



app.use(cors(corsOptions));

//reczne ustawianie naglowka pozwalajacego
/*app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://chowrat.org:80/');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  
    next();
  });*/

app.get('/', (req, res) => {
    res.json( integer)
})

app.post('/', (req, res) => {
    console.log(req.body)
    integer = req.body
    res.json(integer)
})

https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'sec/chowrat.net.key')),
  cert: fs.readFileSync(path.join(__dirname, 'sec/chowrat.net.crt'))
}, app).listen( port, function(){
  console.log(`Example app listening on port ${port}!`)
} )


//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
