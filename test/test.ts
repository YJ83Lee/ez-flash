import flash = require('./../dist/ez-flash');

import {Request, Response, NextFunction} from 'express';

import express = require('express');
import session = require('express-session');
import request = require('supertest');

const typeMsgs = [
    {type: 'success', message: 'success message'},
    {type: 'info', message: 'info message'}
];
let nonEmptyFlashMsg: { [index:string] : string } = {};
for (const typeMsg of typeMsgs) {
    nonEmptyFlashMsg[typeMsg.type] = typeMsg.message;
}

function setupFlashMsgs(req: Request, res: Response, next: NextFunction) {
    for (const typeMsg of typeMsgs) {
        flash.flash(typeMsg.type, typeMsg.message);
    }
    next();
}

function setupReqSessionFlash(req: Request, res: Response, next: NextFunction) {
    req.session!.flash = {};
    for (let typeMsg of typeMsgs) {
        req.session!.flash[typeMsg.type] = typeMsg.message;
    }
    next();
}

const sessionObj = session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true
});

const getRouter = express.Router();

getRouter.get('/reqSessionFlash', (req, res) => {
    res.status(200).json({flash: req.session!.flash});
});

getRouter.get('/resLocalsFlash', (req, res) => {
    res.status(200).json({flash: res.locals.flash});
});

describe('flash()', () => {
    const app = express();

    app.use(sessionObj);
    app.use(flash.middleware);
    app.use(setupFlashMsgs);
    app.use(getRouter);

    const agent = request(app);

    it('Should modify req.session.flash', (done) => {
        agent.get('/reqSessionFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });

    it('Should not modify res.locals.flash yet', (done) => {
        agent.get('/reqSessionFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });
});

describe('middleware()', () => {
    const app = express();

    app.use(sessionObj);
    app.use(setupReqSessionFlash);
    app.use(flash.middleware);
    app.use(getRouter);

    const agent = request(app);

    it('Should clean up req.session.flash', (done) => {
        agent.get('/reqSessionFlash').expect(200, {}, done);
    });

    it('Should move req.session.flash to res.locals.flash', (done) => {
        agent.get('/resLocalsFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });
});

describe('reFlashAll()', () => {
    const app = express();

    app.use(sessionObj);
    app.use(setupReqSessionFlash);
    app.use(flash.middleware);
    app.use((req, res, next) => {
        flash.reFlashAll();
        next();
    });
    app.use(getRouter);

    const agent = request(app);

    it('Should move flash message back to req.session.flash from res.locals.flash', (done) => {
        agent.get('/reqSessionFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });

    it('Should not clean up res.locals.flash', (done) => {
        agent.get('/resLocalsFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });
});

describe('reFlashAll(cleanUp = true)', () => {
    const app = express();

    app.use(sessionObj);
    app.use(setupReqSessionFlash);
    app.use(flash.middleware);
    app.use((req, res, next) => {
        flash.reFlashAll(true);
        next();
    });
    app.use(getRouter);

    const agent = request(app);

    it('Should move flash message back to req.session.flash from res.locals.flash', (done) => {
        agent.get('/reqSessionFlash').expect(200, {flash: nonEmptyFlashMsg}, done);
    });

    it('Should clean up res.locals.flash', (done) => {
        agent.get('/resLocalsFlash').expect(200, {}, done);
    });
});
