import path from 'path';
import cookieParser from 'cookie-parser';
import express from 'express';
import router from './routes';
import paymentRouter from './routes/payments';
import verifyUser from './middleware';

const port = process.env.PORT;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(verifyUser);
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.message = req.message;
  next();
});
app.use(router);
app.use(paymentRouter);
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Running on port ${port}`));
