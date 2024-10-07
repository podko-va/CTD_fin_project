const express = require('express')
const router = express.Router()

const {register,login,decodeJWT} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/decode', decodeJWT)


module.exports = router

