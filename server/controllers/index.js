import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';

const { Book, User } = models;

export const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const { id, hash } = user;
      const isVerifiedPassword = bcrypt.compareSync(password, hash);
      if (!isVerifiedPassword) {
        return { status: 401, message: 'Incorrect password' };
      }
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      return { token };
    }
    return { status: 401, message: 'User does not exist' };
  } catch {
    return { status: 500, message: 'Internal server error' };
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists) {
      return { status: 401, message: 'A user with that email already exists' };
    }
    const user = await User.create({
      name,
      email,
      hash: bcrypt.hashSync(password, 10),
    });
    const { id } = user;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    return { token };
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Internal server error' };
  }
};

export const fetchAllBooks = async () => {
  try {
    const books = await Book.findAll();
    return books;
  } catch (error) {
    return null;
  }
};

export const fetchBook = async (id) => {
  try {
    const book = await Book.findOne({
      where: {
        id,
      },
    });
    return book;
  } catch (error) {
    return {};
  }
};
