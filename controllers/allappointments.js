const Appointment = require('../models/Appointment')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllAppointmentsAdmin = async (req,res) => {
    const appointments = await Appointment.find({psychologist: null});
      res.status(StatusCodes.OK).json({appointments, count: appointments.length})
}

module.exports = {
    getAllAppointmentsAdmin,
}