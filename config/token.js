var jsonwebtoken = require('jsonwebtoken');
var secretKey = require('./config').secretKey;

function generateToken(entity, role) {
    let payload = {
        _id: entity._id,
        name: entity.name,
        email: entity.email,
        ...entity,
        role: role
    };

    var token = jsonwebtoken.sign(payload, secretKey, {
        expiresIn: 60 * 60 * 24 * 7
    });

    return {
        token: token,
        expiresIn: jsonwebtoken.decode(token).exp
    };

}

module.exports = {
    generateToken: generateToken
};
