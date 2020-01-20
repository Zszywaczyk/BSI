const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
var integer = { value: 34 }

app.use(express.json())
app.use(express.urlencoded({ extended: true, }))

var whitelist = 'http://chowrat.org:80/'
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

app.all('/*', function(req, res, next) {
    //res.header('Access-Control-Allow-Origin', 'http://chowrat.org:80/');
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log('cos ' +JSON.stringify(req.headers.origin) );
  
    next();
  });

app.get('/', (req, res) => {
    res.json( integer)
})

app.post('/', (req, res) => {
    console.log(req.body)
    integer = req.body
    res.json(integer)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
