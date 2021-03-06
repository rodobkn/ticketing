import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rmltickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
//We are trusting in the ingress-nginx proxy as secure traffic
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    //We are not encrypting the cookie
    signed: false,
    //We will allow to use the cookie only in https (secure connections)
    //Besides, in the test environment we will not do https requests. For this reason el env variable
    // secure: process.env.NODE_ENV !== 'test',
    secure: false, //This is for the prod environment, because we don't hace the HTTPS setup in prod
  })
);

//This set up the req.currentUser property
app.use(currentUser);

app.use(createChargeRouter);

//When the client doesn't matched any route
//Remember that we are using a package to
//handling async errors easier
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
