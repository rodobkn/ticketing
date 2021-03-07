import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rmltickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

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
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//When the client doesn't matched any route
//Remember that we are using a package to
//handling async errors easier
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
