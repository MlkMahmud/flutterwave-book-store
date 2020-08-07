import jwt from 'jsonwebtoken';
import models from '../models';

const PUBLIC_ROUTES = ['/', '/books', '/login', '/register'];

function verifyUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    if (PUBLIC_ROUTES.includes(req.path)) {
      req.user = null;
      next();
    } else res.redirect('/login');
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, { id }) => {
      if (err) {
        if (PUBLIC_ROUTES.includes(req.path)) {
          req.user = null;
          next();
        } else res.redirect('/login');
      } else {
        const { User } = models;
        const user = await User.findOne({
          where: id,
        });
        req.user = user;
        next();
      }
    });
  }
}

export default verifyUser;
