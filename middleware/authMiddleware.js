const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_top';

function authMiddleware(req, res, next) {
    console.log(JSON.stringify(req.headers));
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
