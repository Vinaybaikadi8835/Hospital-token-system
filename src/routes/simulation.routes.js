const express = require("express");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
const { allocateToken } = require("../services/allocation.service");

const router = express.Router();

/**
 * Simulate one OPD day
 */
router.post("/day", async (req, res) => {
  const log = [];

  const doctors = await Doctor.find();

  for (const doctor of doctors) {
    const slots = await Slot.find({ doctorId: doctor._id });

    for (const slot of slots) {
      // 1️⃣ Walk-ins fill 70%
      const walkIns = Math.floor(slot.capacity * 0.7);
      for (let i = 0; i < walkIns; i++) {
        const result = await allocateToken({
          doctorId: doctor._id,
          slotId: slot._id,
          patientName: `WalkIn-${i}`,
          source: "WALK_IN"
        });
        log.push({ doctor: doctor.name, slot: slot.time, result });
      }

      // 2️⃣ Paid priority arrives
      const paid = await allocateToken({
        doctorId: doctor._id,
        slotId: slot._id,
        patientName: "Paid-Patient",
        source: "PAID"
      });
      log.push({ doctor: doctor.name, slot: slot.time, paid });

      // 3️⃣ Emergency
      const emergency = await allocateToken({
        doctorId: doctor._id,
        slotId: slot._id,
        patientName: "Emergency-Patient",
        source: "EMERGENCY"
      });
      log.push({ doctor: doctor.name, slot: slot.time, emergency });
    }
  }

  res.json({ message: "OPD Day Simulated", log });
});

module.exports = router;
