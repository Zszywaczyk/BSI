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

const httpsAgent = new https.Agent({
  rejectUnauthorized: true,
  cert: fs.readFileSync(path.join(__dirname,'sec/chowrat.net.crt'))
})

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

app.get('/rest', function(req, res){
  axios.get('https://chowrat.net:3000',{ httpsAgent, 
  headers: {origin: 'https://chowrat.org/'} })
  .then((rest) => {
    //console.log(rest.data);
    res.send(rest.data);
  });
});
app.post('/rest', function(req, res){
  axios.post('https://chowrat.net:3000/', req)
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


