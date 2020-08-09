import { Router } from 'express';
import { fetchBook } from '../controllers';
import {
  initiatePayment,
  verifyPayment,
  approveRefund,
} from '../controllers/payments';

const router = Router();

router.get('/book/:id', async (req, res) => {
  const { id } = req.params;
  const { user: customer } = req;
  const book = await fetchBook(+id);
  const { url, error } = await initiatePayment({ book, customer });
  if (url) {
    res.redirect(url);
  } else {
    res.status(500).json(error);
  }
});

router.get('/charge', async (req, res) => {
  const { transaction_id: id } = req.query;
  const { status, error } = await verifyPayment(id);
  if (status) {
    res.redirect('/library');
  } else res.status(500).json(error);
});

router.get('/refund/:id', async (req, res) => {
  const { id } = req.params;
  if (req.user && !req.user.iAdmin) {
    res.json({ message: 'Only admin users can approve refunds' });
  } else {
    const { error, status } = await approveRefund(id);
    if (status) {
      res.redirect('/dashboard');
    } else res.json(error);
  }
});

export default router;
