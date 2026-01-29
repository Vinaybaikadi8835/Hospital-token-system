const express = require("express");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");

const router = express.Router();

/**
 * Create Doctor
 */
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Create Slot for Doctor
 */
router.post("/:doctorId/slots", async (req, res) => {
  try {
    const { time, capacity } = req.body;

    const slot = new Slot({
      doctorId: req.params.doctorId,
      time,
      capacity
    });

    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Get Doctor Slots
 */
router.get("/:doctorId/slots", async (req, res) => {
  const slots = await Slot.find({ doctorId: req.params.doctorId });
  res.json(slots);
});

module.exports = router;
