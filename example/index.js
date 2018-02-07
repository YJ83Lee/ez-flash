var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('./../dist/ez-flash');
var path = require('path');
var app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: true }));
app.use(flash.middleware);

app.get('/', function (req, res) {
  flash.reFlashAll();
  res.redirect('/singleMsg');
});

app.get('/singleMsg', function (req, res) {
  res.render('singleMsg', { title: 'ez-flash single message example' });
});

app.post('/singleMsg', function (req, res) {
  flash.flash('message', req.body.message);
  res.redirect('/');
});

app.get('/multipleMsg', function (req, res) {
  res.render('multipleMsg', { title: 'ez-flash multiple messages example' });
});

app.post('/multipleMsg', function (req, res) {
  var msgTypes = ['success', 'info', 'warning', 'danger'];
  for (var i = 0; i < msgTypes.length; ++i) {
    if (req.body[msgTypes[i]]) {
      flash.flash(msgTypes[i], req.body[msgTypes[i]]);
    }
  }
  res.redirect('/multipleMsg');
})

app.listen(3000);
