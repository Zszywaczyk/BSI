//http
var express = require('express')
var app = express()
var fs = require('fs')
var https = require('https')
var http = require('http')
var router = express.Router()
var path = require('path')
var forceSsl = require('express-force-ssl');
var axios = require('axios');

var jwt = require('jsonwebtoken')
var token = jwt.sign({id: 2}, 'nieprawdopodobnySekret', {expiresIn: 120})
console.log(token)

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: fs.readFileSync(path.join(__dirname,'sec/chowrat.net.crt'))
})

var auth = {username: "tomek", password: "razdwa3"}

app.use(express.json());

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path)
  next()
})

// this will only be invoked if the path starts with /bar from the mount point
router.use('/', function (req, res, next) {
  next()
})
/*router.get('/', function(req, res) {
  res.set('Content-Type', 'text/html')
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile('index.html', options) 
});*/

app.get('/', function(req, res){
  res.set('Content-Type', 'text/html')
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile('index.html', options)
})

/*app.get('/rest', function(req, res){
  axios.get('https://chowrat.net:3000/basic',{ httpsAgent, 
  headers: {origin: 'https://chowrat.org/'}, auth: auth })
  .then((rest) => {
    //console.log(rest.data);
    res.send(rest.data);
    //console.log(rest.data)
  });
});

app.post('/rest', function(req, res){
  //console.log({value: req.body.value})
  axios.post('https://chowrat.net:3000/basic', {value: req.body.value}, {httpsAgent, headers: {origin: 'https://chowrat.org/'}, auth: auth })
  .then((response) => {
    res.send(response.data)
  })
})*/

app.get('/rest', function(req, res){
  axios.get('https://chowrat.net:3000/jwt',{ httpsAgent, 
  headers: {origin: 'https://chowrat.org/', 'Authorization': `Bearer ${token}` } })
  .then((rest) => {
    //console.log(rest.data);
    res.send(rest.data);
    //console.log(rest.data)
  });
});

app.post('/rest', function(req, res){
  //console.log({value: req.body.value})
  axios.post('https://chowrat.net:3000/jwt', {value: req.body.value}, {httpsAgent, headers: {origin: 'https://chowrat.org/', 'Authorization': `Bearer ${token}`} })
  .then((response) => {
    res.send(response.data)
  })
})


//if would be /foo then chowrat.org:80/foo/home /etc

app.use('/', router)
app.use(forceSsl)
http.createServer(app).listen(80)

https.createServer({
  key: fs.readFileSync(path.join(__dirname,'sec/chowrat.org.key')),
  cert: fs.readFileSync(path.join(__dirname,'sec/chowrat.org.crt'))
}, app)
.listen(443, function(){
  console.log('Port 443 started')
})


