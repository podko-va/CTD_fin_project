const Appointment = require('../models/Appointment')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllAppointments = async (req,res) => {
    const appointments = await Appointment.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({appointments, count: appointments.length})
}

const getAppointment = async (req,res) => {
    const {user:{userId}, params:{id:appointmentId}} = req
    const appointment = await Appointment.findOne({
        _id:appointmentId, createdBy:userId
    })
    console.log(appointment)
    if (!appointment) {
        throw new NotFoundError(`No appointment with id ${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({appointment})    
}

const createAppointment = async (req,res) => {
    req.body.createdBy = req.user.userId
    const appointment = await Appointment.create(req.body)
    res.status(StatusCodes.CREATED).json({appointment})
}

const updateAppointment = async (req,res) => {
    const {
        body:{company,position},
        user:{userId}, 
        params:{id:appointmentId}
    } = req
    
    if (company === '' || position === ''){
        throw new BadRequestError(`Company or position must not be empty`)
    }
    const appointment = await Appointment.findOneAndUpdate(
        {_id:appointmentId, createdBy:userId},
        {company,position},
        {new: true, runValidators: true}
    )
    console.log(appointment)
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
        {_id:appointmentId, createdBy:userId},
    )
    console.log(appointment)
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
