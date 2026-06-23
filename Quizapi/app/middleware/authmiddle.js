const jwt = require('jsonwebtoken');

var secretkey = '123456'

const authMiddleware = (req, res, next) => {
    try {
        console.log(req.headers.authorization);

        const token = req.headers.authorization.split(" ")[1];

        console.log(token);

        const decoded = jwt.verify(token, secretkey);

        console.log(decoded,'decoded');

        req.admin = decoded;

        next();
    } catch (error) {
        console.log(error);
        return res.send({
            _status: false,
            _message: error.message
        });
    }
}
module.exports = authMiddleware;