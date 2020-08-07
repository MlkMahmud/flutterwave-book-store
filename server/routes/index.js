import { Router } from 'express';
import {
  fetchAllBooks,
  fetchUsersBooks,
  loginUser,
  registerUser,
} from '../controllers';

const router = Router();

router.get(['/', '/books'], async (req, res) => {
  const books = await fetchAllBooks();
  res.render('books', { books });
});

router
  .route('/login')
  .get(async (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const { message, status, token } = await loginUser({ email, password });
    if (token) {
      res.cookie('token', token, { httpOnly: true });
      return res.redirect('/');
    }
    return res.status(status).render('login', { message });
  });

router
  .route('/register')
  .get(async (req, res) => {
    res.render('register');
  })
  .post(async (req, res) => {
    const { name, email, password } = req.body;
    const { message, status, token } = await registerUser({
      name,
      email,
      password,
    });
    if (token) {
      res.cookie('token', token, { httpOnly: true });
      return res.redirect('back');
    }
    return res.status(status).render('register', { message });
  });

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
});

router.get('/library', async (req, res) => {
  const { id } = req.user;
  const { books, error } = await fetchUsersBooks(id);
  if (books) {
    res.render('library', { books });
  } else res.json(error);
});

export default router;
