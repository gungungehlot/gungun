const jwt = require('jsonwebtoken');

const secretkey = '123456';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, secretkey);

        req.admin = decoded;

        next();
    } catch (error) {
        return res.send({
            _status: false,
            _message: "Invalid or Expired Token"
        });
    }
};

module.exports = authMiddleware;