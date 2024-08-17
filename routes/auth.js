const express = require('express')
const router = express.Router()

const {register,login} = require('../controllers/auth')

console.log(1)
router.post('/register', register)
router.post('/login', login)

module.exports = router

