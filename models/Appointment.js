const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please provide a consultation date'],
    },
    timezone: {
        type: String,
        required: [false, 'Please provide the timezone'],
        enum: ['PDT', 'CET', 'EDT', 'UTC', 'GMT', 'EST', 'IST', 'CST'], // example timezone options
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [false, 'Please provide the patient'],
    },
    psychologist: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the psychologist'],
    },
    description: {
        type: String,
        required: [false, 'Please provide a link to the consultation'],
    },
    reserved: {
        type: Boolean,
        default: false,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    booked: {
        type: Boolean,
        default: false,
    },
    freePromo: {
        type: Boolean,
        default: false,
    },
    estimation: {
        type: String,
        default: '',
    },
    comments: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
