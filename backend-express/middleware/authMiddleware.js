const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if(err){
                res.status(500).json({ error: err.message })
            }else{
                next()
            }
        })
    }else{
        res.status(401).json({ error: 'no token, no access.' })
    }
}

const roleAccess = (permissions) => {
    return (req, res, next) => {
        const userRole = req.body.role != undefined ?  req.body.role : res.status(401).json({ error: 'required role to access endpoint.' })
        if(permissions.includes(userRole)){
            next()
        }else{
            res.status(401).json({ error: 'You dont have permissions.' });
        }
    }
}

const checkUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if(err){
                res.locals.id = null
                next()
            }else{
                res.locals.id = decodedToken.sub
                next()
            }
        })
    }else{
        res.locals.id = null
        next()
    }
}

module.exports = { requireAuth, roleAccess, checkUser}