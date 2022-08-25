const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if(err){
                console.log('1');
                res.status(500).send(err.message)
            }else{
                console.log('2');
                next()
                // return decodedToken
                // res.status(200).send(decodedToken)
            }
        })
    }else{
        res.status(401).send('no token, no access.')
    }
}

module.exports = { requireAuth }