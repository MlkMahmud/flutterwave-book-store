/* eslint-disable camelcase */
import axios from 'axios';
import { v4 } from 'uuid';
import models from '../models';

const { Transaction } = models;
const { SECRET_KEY } = process.env;
const headers = {
  Authorization: `Bearer ${SECRET_KEY}`,
  'Content-Type': 'application/json',
};

export const initiatePayment = async ({ book, customer }) => {
  try {
    const url = 'https://api.flutterwave.com/v3/payments';
    const redirect_url = 'https://flutter-book-store.herokuapp.com/charge';
    const { price, title, author } = book;
    const { name, email } = customer;
    const payload = {
      tx_ref: v4(),
      amount: price,
      payment_options: 'card, banktransfer, ussd',
      redirect_url,
      customer: {
        name,
        email,
      },
      customizations: {
        title: 'The Bookstore',
        description: `${title} by ${author}`,
        logo: 'https://assets.piedpiper.com/logo.png',
      },
      currency: 'NGN',
      meta: {
        bookId: book.id,
        customerId: customer.id,
      },
    };
    const response = await axios(url, {
      method: 'POST',
      data: payload,
      headers,
    });
    const { data } = response;
    if (data.status === 'success') {
      return { url: data.data.link };
    }
    throw Error(JSON.stringify(data));
  } catch (error) {
    return { error };
  }
};

export const verifyPayment = async (id) => {
  try {
    const url = `https://api.flutterwave.com/v3/transactions/${id}/verify`;
    const { data } = await axios(url, {
      headers,
    });
    const { status, message, data: details } = data;
    const {
      id: transactionId, amount, charged_amount, meta,
    } = details;
    if (status !== 'success' || amount < charged_amount) {
      throw Error(message);
    }
    await Transaction.create({
      BookId: Number(meta.bookId),
      UserId: Number(meta.customerId),
      transactionId,
    });
    return { status };
  } catch (error) {
    return { error };
  }
};

export const requestRefund = async (transactionId) => {
  try {
    await Transaction.update(
      {
        requested_refund: true,
      },
      {
        where: { transactionId },
      },
    );
    return { status: 'success' };
  } catch (error) {
    return { error };
  }
};

export const approveRefund = async (id) => {
  try {
    const url = `https://api.flutterwave.com/v3/transactions/${id}/refund`;
    const { data } = await axios(url, {
      headers,
      method: 'POST',
    });
    if (data && data.status === 'success') {
      await Transaction.update(
        { received_refund: true },
        { where: { transactionId: id } },
      );
      return { status: data.status };
    } throw Error(data);
  } catch (error) {
    return { error };
  }
};
