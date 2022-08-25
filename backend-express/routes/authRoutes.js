const { Router } = require('express')
const authController = require('../controller/authController')

const router = Router

router.get('/user', authController.user_get)

module.exports = router