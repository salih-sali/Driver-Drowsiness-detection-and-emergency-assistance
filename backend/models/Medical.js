
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicalSchema = new Schema({
    phone: Number,
    doctorName: String,
    doctorNum: Number,
    clinicName: String,
    bloodGroup: String,
    isHeartPatient: String,
    isDiabeticPatient: String,
    isBpPatient: String,
    allergicToMedication: String,
    isDialisysPatient: String,
    lastBloodDonation: String,
    otherDisease: String,
    regularMedication: String,
    surgery: String
});

const Medical = mongoose.model('Medical', MedicalSchema);
module.exports = Medical;
