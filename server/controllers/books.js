import models from '../models';

const { Book } = models;

export const fetchAllBooks = async () => {
  try {
    const books = await Book.findAll();
    return books;
  } catch (error) {
    console.log(error);
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
    console.error(error);
    return {};
  }
};
