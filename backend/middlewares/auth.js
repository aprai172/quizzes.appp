const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(403).json({ message: 'Authentication required' });
    }
    const decodedData = jwt.verify(token, 'secret');
    req.user = { _id: decodedData?.id };
    next();
  } catch (error) {
    res.status(403).json({ message: error.message });
    console.log(error);
  }
};

module.exports = auth;





