# ez-flash
An easy flash message middleware for Express.js 4.x 

## Table of Content
- [Usage](#usage)
- [How it works](#how-it-works)
- [Test](#test)
- [Special thanks](#special-thanks)

## Usage
### Install
````bash
$ npm install ez-flash
````
### Use
see [example folder](https://github.com/YJ83Lee/ez-flash/tree/master/example) for a complete example with express.js

#### Setup
example/index.js
````javascript
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('ez-flash');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: true }));
app.use(flash.middleware);
````

#### Basic Usage
##### flash a message
example/index.js
````javascript
app.post('/singleMsg', function (req, res) {
  flash.flash('message', req.body.message);
  res.redirect('/');
});
````
##### re-flash after more than one redirect
example/index.js
````javascript
app.get('/', function (req, res) {
  flash.reFlashAll();
  res.redirect('/singleMsg');
});
````
##### show the flash message
example/view/includes/flash.pug
````jade
each content, type in flash
    h2 flash message: #{content}
````

#### Combining Bootstrap Alert
##### flash multiple messages
example/index.js
````javascript
app.post('/multipleMsg', function (req, res) {
  var msgTypes = ['success', 'info', 'warning', 'danger'];
  for (var i = 0; i < msgTypes.length; ++i) {
    if (req.body[msgTypes[i]]) {
      flash.flash(msgTypes[i], req.body[msgTypes[i]]);
    }
  }
  res.redirect('/multipleMsg');
})
````
##### render
example/flash.pug
````jade
each content, type in flash
    if type === 'success' || type === 'info' || type === 'warning' || type === 'danger'
        div(class="alert alert-" + type)= content
````
## How it works
### flash(type, message)
Init ``session.flash`` if needed, then save the flash message to it.

### middleware()
Move the flash message from locals to session so we can access the flash message in the view with ``flash`` object.

### reFlashAll(cleanUp = false)
Copy the flash message from locals to session, making the flash message available for the next response.
The message in locals will be deleted (not shown this time) if ``cleaUp = true``.
## Tests
````bash
$ tsc
$ tsc test/test.ts
$ npm test
````

## Special thanks
[Laravel flash data](https://laravel.com/docs/5.5/session#flash-data) for the desired function and syntax.

[tsmean](https://www.tsmean.com) for how to write the package.

[express/flash](https://github.com/expressjs/flash) for how to write the test code.
