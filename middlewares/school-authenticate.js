const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/config');

function schoolAuthenticate(req, res, next) {

    let token = req.body.token || req.param('token') || req.headers['authorization'];

    if (token) {
        jsonwebtoken.verify(token, config.secretKey, (err, decoded) => {
            if (err) {
                res.status(403).send({
                    success: false,
                    message: "Token Not Valid"
                });
            } else {
                if (decoded.role === 'School') {
                    req.decoded = decoded;
                    next();
                } else {
                    res.status(403).send({
                        success: false,
                        message: "Not A School"
                    });
                }

            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: "Token Not Provided"
        });
    }
};


module.exports = {
    schoolAuthenticate : schoolAuthenticate,
}