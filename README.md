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
example/index.ts
````typescript
import express = require('express');
import bodyParser = require('body-parser');
import session = require('express-session');
import flash = require('ez-flash');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: true}));
app.use(flash.middleware);
````

#### Basic Usage
##### flash a message
example/index.ts
````typescript
app.post('/singleMsg', (req, res) => {
    flash.flash('message', req.body.message);
    res.redirect('/');
});
````
##### re-flash after more than one redirect
example/index.ts
````typescript
app.get('/', (req, res) => {
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
example/index.ts
````typescript
app.post('/multipleMsg', (req, res) => {
    for (const msgType of ['success', 'info', 'warning', 'danger']) {
        if (req.body[msgType]) {
            flash.flash(msgType, req.body[msgType]);
        }
    }
    res.redirect('/multipleMsg');
});
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
Init ``req.session.flash`` if needed, then set ``req.session.flash.type = message``.

### middleware()
``req.session.flash = res.locals.flash``, so we can access the flash message in the view with ``flash`` object.

``delete req.session.flash`` so the flash message will not in following responses after the current one.

### reFlashAll(cleanUp = false)
``req.session.flash = res.locals.flash``, makes the flash message available for the next response.

``req.locals.flash`` will be deleted if ``cleaUp = true``.
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
