const mongoose = require("mongoose");
const { Schema } = mongoose;

const PrescriptionSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  patient: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  doctorName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  medicines: {
    type: [
      {
        name: String,
        dosage: String,
        duration: String,
        time: String,
        frequency: [String],
        state: String,
        eatenTime: String,
      },
    ],
  },
  refill: {
    type: Boolean,
  },
});

module.exports = mongoose.model("prescription", PrescriptionSchema);
