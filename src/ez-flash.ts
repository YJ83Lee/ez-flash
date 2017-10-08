import {NextFunction, Request, Response} from "express";

let session: any;
let locals: any;

export function middleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session) {
        throw "Must have session to use flash message";
    }

    session = req.session;
    locals = res.locals;

    locals.flash = session.flash;

    delete req.session.flash;

    next();
}

export function flash(type: string, content: string) {
    if (session.flash === undefined) {
        session.flash = {};
    }

    session.flash[type] = content;
}

export function reFlashAll(cleanUp: boolean = false) {
    session.flash = locals.flash;

    if (cleanUp) {
        locals.flash = undefined;
    }
}
