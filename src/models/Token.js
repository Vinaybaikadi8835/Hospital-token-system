const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  tokenId: String,
  patientName: String,

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot"
  },

  source: {
    type: String,
    enum: ["WALK_IN", "FOLLOW_UP", "PAID", "EMERGENCY"],
    required: true
  },

  priority: Number,

  status: {
    type: String,
    enum: ["ACTIVE", "CANCELLED", "COMPLETED", "NO_SHOW"],
    default: "ACTIVE"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Token", TokenSchema);
