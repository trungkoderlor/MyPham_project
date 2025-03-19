module.exports.storeReturnUrl = async (req, res, next) => {
  if (req.method === 'GET' && req.path !== '/user/login') {
    req.session.returnTo = req.originalUrl;
  }
  next();
}