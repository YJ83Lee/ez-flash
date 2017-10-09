import express = require('express');
import bodyParser = require('body-parser');
import session = require('express-session');

import flash = require('./../dist/ez-flash');

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: true}));
app.use(flash.middleware);

app.get('/', (req, res) => {
    flash.reFlashAll();
    res.redirect('/singleMsg');
});

app.get('/singleMsg', (req, res) => {
    res.render('singleMsg', {title: 'ez-flash single message example'});
});

app.post('/singleMsg', (req, res) => {
    flash.flash('message', req.body.message);
    res.redirect('/');
});

app.get('/multipleMsg', (req, res) => {
    res.render('multipleMsg', {title: 'ez-flash multiple messages example'});
});

app.post('/multipleMsg', (req, res) => {
    for (const msgType of ['success', 'info', 'warning', 'danger']) {
        if (req.body[msgType]) {
            flash.flash(msgType, req.body[msgType]);
        }
    }

    res.redirect('/multipleMsg');
});

app.listen(3000);