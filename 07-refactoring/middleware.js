const jwt = require('jsonwebtoken');

// this is a middleware function that check if a valid JWT has been provided
// a middleware function has three arugments: req, res, next
function authenticateWithJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        // first argument: the token that I want to verify
        // second argument: the token secret
        // third argument: callback function
        jwt.verify(token, process.env.TOKEN_SECRET, function(err,payload){
            if (err) {
                res.status(400);
                return res.json({
                    'error': err
                })
            } else {
                // the JWT is valid, forward request to the route and store the payload in the request
                req.payload = payload;
                next();
            }
        })
    } else {
        res.status(400);
        res.json({
            'error':'Login required to access this route'
        })
    }
}

module.exports = { authenticateWithJWT};