import express from 'express';

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status ? err.status : 500;
    const message = err.message ? err.message : "Bad request.";

    console.error(err.stack);
    res.status(status).send(message);
}