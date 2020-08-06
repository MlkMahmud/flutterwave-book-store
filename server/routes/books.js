import { Router } from 'express';
import { fetchAllBooks, fetchBook } from '../controllers/books';

const router = Router();

router.get(['/', '/books'], async (req, res) => {
  const books = await fetchAllBooks();
  res.render('books', { books });
});

router.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const book = await fetchBook(id);
  res.render('book', { book });
});

export default router;
