const express = require("express");
const { allocateToken } = require("../services/allocation.service");

const router = express.Router();

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

module.exports = router;
