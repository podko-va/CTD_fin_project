const express = require('express')
const router = express.Router()

const {getAllAppointmentsAdmin} = require('../controllers/allappointments')

router.route('/').get(getAllAppointmentsAdmin)

module.exports = router