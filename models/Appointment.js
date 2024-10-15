const mongoose = require('mongoose');
const User = require('./User'); // Импортируем модель User

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
    patientEmail: {
        type: String,
        required: [false, 'Please provide the patient`s email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'],
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

// Хук для поиска пациента по email перед сохранением консультации
AppointmentSchema.pre('save', async function (next) {
    // Если email пациента указан, ищем пользователя по email
    if (this.patientEmail) {
        try {
            const user = await User.findOne({ email: this.patientEmail });
            if (user) {
                this.patient = user._id; // Если пользователь найден, присваиваем его ID полю patient
            } else {
                throw new Error('Patient not found with the provided email');
            }
        } catch (err) {
            return next(err); // Если ошибка, передаем ее в следующий middleware
        }
    }
    next(); // Переход к следующему middleware или сохранению
});
// Хук для поиска пациента по email перед обновлением записи
AppointmentSchema.pre('findOneAndUpdate', async function (next) {
    // Получаем обновленные данные
    const update = this.getUpdate();

    // Проверяем, есть ли поле patientEmail в обновлении
    if (update.patientEmail) {
        try {
            const user = await User.findOne({ email: update.patientEmail });
            if (user) {
                // Если пользователь найден, добавляем его ID в обновление
                this.setUpdate({ ...update, patient: user._id });
            } else {
                throw new Error('Patient not found with the provided email');
            }
        } catch (err) {
            return next(err); // Если ошибка, передаем ее в следующий middleware
        }
    }

    next(); // Переход к следующему middleware или выполнению обновления
});
module.exports = mongoose.model('Appointment', AppointmentSchema);
