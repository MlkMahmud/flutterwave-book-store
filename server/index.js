import path from 'path';
import express from 'express';
import bookRouter from './routes/books';

const port = process.env.PORT;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bookRouter);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Running on port ${port}`));
