var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path)
  next()
})

// this will only be invoked if the path starts with /bar from the mount point
router.use('/', function (req, res, next) {
  
  /*res.send(path.join(__dirname, 'public'));*/



  
  //res.send('okej')
  // ... maybe some additional /bar logging ...
  next()
})
router.get('/', function(req, res) {
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
});


//if would be /foo then chowrat.org:80/foo/home /etc
app.use('/', router)

app.listen(80)