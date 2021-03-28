/**
 * Middleware for json-server to set a 5 minute TTL on API responses
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
module.exports = (req, res, next) => {
  res.header("Cache-Control", "max-age=300");
  res.header("Expires", new Date(new Date().getTime() + 300000).toUTCString());
  next();
};
