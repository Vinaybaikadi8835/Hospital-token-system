const express = require("express");
const { allocateToken } = require("../services/allocation.service");

const router = express.Router();

const Token = require("../models/Token");
const Slot = require("../models/Slot");

/**
 * Create Token
 */
router.post("/", async (req, res) => {
  try {
    const result = await allocateToken(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Cancel Token
 */
router.post("/:tokenId/cancel", async (req, res) => {
  try {
    const token = await Token.findOne({ tokenId: req.params.tokenId });

    if (!token || token.status !== "ACTIVE") {
      return res.status(400).json({ error: "Invalid or inactive token" });
    }

    token.status = "CANCELLED";
    await token.save();

    const slot = await Slot.findById(token.slotId);
    slot.currentCount = Math.max(0, slot.currentCount - 1);
    await slot.save();

    res.json({ message: "Token cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Mark No-Show
 */
router.post("/:tokenId/no-show", async (req, res) => {
  try {
    const token = await Token.findOne({ tokenId: req.params.tokenId });

    if (!token || token.status !== "ACTIVE") {
      return res.status(400).json({ error: "Invalid token" });
    }

    token.status = "NO_SHOW";
    await token.save();

    const slot = await Slot.findById(token.slotId);
    slot.currentCount = Math.max(0, slot.currentCount - 1);
    await slot.save();

    res.json({ message: "Token marked as NO-SHOW" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
