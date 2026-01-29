const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  time: {
    type: String, // e.g. "09:00-10:00"
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Slot", SlotSchema);
