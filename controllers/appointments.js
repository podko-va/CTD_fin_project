const Appointment = require('../models/Appointment')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')
const { closestTo } = require('date-fns')

const getAllAppointments = async (req,res) => {
    const appointments = await Appointment.find(
        req.user.isPsychologist ? { psychologist: req.user.userId } : { patient: req.user.userId }
      ).sort({ date: 1 });
      res.status(StatusCodes.OK).json({appointments, count: appointments.length})
}

const getAppointment = async (req,res) => {
    const {user:{userId}, params:{id:appointmentId}} = req
    const appointment = await Appointment.findOne({
        _id:appointmentId//, psychologist:userId
    })
    if (!appointment) {
        throw new NotFoundError(`No appointment with id ${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({appointment})    
}

const createAppointment = async (req,res) => {
    if (req.user.isPsychologist === 1) {
        req.body.psychologist = req.user.userId;
    } else {
        req.body.patient = req.user.userId;
    };
    const appointment = await Appointment.create(req.body)
    res.status(StatusCodes.CREATED).json({appointment})
}

const updateAppointment = async (req,res) => {
    const {
        body:{date,timezone,psychologist,patient,description,patientEmail,psychologistName},
        params:{id:appointmentId}
    } = req
    
    if (date === '' || timezone === ''){
        throw new BadRequestError(`Date must not be empty`)
    }
    const appointment = await Appointment.findOneAndUpdate(
        {_id:appointmentId, $or: [{ psychologist: psychologist }, { patientEmail: patientEmail }]},
        {date,timezone,psychologist,patient,description,patientEmail,psychologistName},
        {new: true, runValidators: true}
    )
    if (!appointment) {
        throw new NotFoundError(`No appointment with id ${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({appointment})    
}

const deleteAppointment = async (req,res) => {
    const {
        user:{userId}, 
        params:{id:appointmentId}
    } = req
    
    const appointment = await Appointment.findOneAndRemove(
        {_id:appointmentId, $or: [{ psychologist: userId }, { patient: userId }]},
    )
    if (!appointment) {
        throw new NotFoundError(`No appointment with id ${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "The appointment was deleted." });    
}

module.exports = {
    getAllAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
}
