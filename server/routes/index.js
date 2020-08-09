import { Router } from 'express';
import {
  fetchAllBooks,
  fetchAllTransactions,
  fetchUsersBooks,
  loginUser,
  registerUser,
} from '../controllers';
import { requestRefund } from '../controllers/payments';

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
      return res.redirect('/');
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

router.get('/returns/:id', async (req, res) => {
  const { id } = req.params;
  const { error, status } = await requestRefund(id);
  if (status) {
    res.redirect('/library');
  } else {
    res.json(error);
  }
});

router.get('/dashboard', async (req, res) => {
  const { isAdmin } = req.user || {};
  if (isAdmin) {
    const { error, transactions } = await fetchAllTransactions();
    if (error) {
      res.json(error);
    } else res.render('dashboard', { transactions });
  } else {
    res.status(403).json({ message: 'This page is unaccessible to non-admin users' });
  }
});

export default router;
