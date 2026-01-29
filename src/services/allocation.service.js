const Slot = require("../models/Slot");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");

const PRIORITY_MAP = {
  EMERGENCY: 4,
  PAID: 3,
  FOLLOW_UP: 2,
  WALK_IN: 1
};
async function allocateToken({ doctorId, slotId, patientName, source }) {
  const priority = PRIORITY_MAP[source];

  const slot = await Slot.findById(slotId);
  if (!slot) throw new Error("Slot not found");

  // Count active tokens
  const activeTokens = await Token.find({
    slotId,
    status: "ACTIVE"
  });

  // CASE 1: Slot has capacity
  if (activeTokens.length < slot.capacity) {
    const token = await Token.create({
      tokenId: uuidv4(),
      patientName,
      doctorId,
      slotId,
      source,
      priority
    });

    slot.currentCount += 1;
    await slot.save();

    return { allocated: true, token };
  }

  // CASE 2: Slot full → check for displacement
  const lowestPriorityToken = activeTokens.reduce((low, curr) =>
    curr.priority < low.priority ? curr : low
  );

  if (priority > lowestPriorityToken.priority) {
    // Displace
    lowestPriorityToken.status = "CANCELLED";
    await lowestPriorityToken.save();

    const newToken = await Token.create({
      tokenId: uuidv4(),
      patientName,
      doctorId,
      slotId,
      source,
      priority
    });

    return {
      allocated: true,
      displacedTokenId: lowestPriorityToken.tokenId,
      token: newToken
    };
  }

  // CASE 3: Cannot allocate
  return { allocated: false, reason: "Slot full & lower priority" };
}

module.exports = { allocateToken };
