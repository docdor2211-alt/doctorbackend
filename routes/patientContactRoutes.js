const express = require("express");

const router = express.Router();

const controller = require("../controllers/patientContactController");

const { protect } = require("../middleware/authMiddleware");

/* =========================
   📇 PATIENT CONTACT CARDS
========================= */

// ✅ GET MY CONTACTS
router.get("/my", protect, controller.getMyContacts);

// ✅ LOOKUP ONE CONTACT
router.get("/lookup", protect, controller.lookupContact);

// ✅ SAVE (UPSERT) CONTACT
router.put("/", protect, controller.saveContact);
router.post("/", protect, controller.saveContact);

// ✅ DELETE CONTACT
router.delete("/:id", protect, controller.deleteContact);

module.exports = router;
