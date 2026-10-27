const express = require("express");
const router = express.Router();

const {
  createPrescription,
  getAllMedicines,
  getPrescriptionByAppointment,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getComplaints,
  createComplaint,
  getClinicServices,
  createClinicService,
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getPrescriptionSettings,
  updatePrescriptionSettings,
} = require("../controllers/docsidePrescriptionController");

const { protect } = require("../middleware/authMiddleware");

/* =====================================================
   ⚙️ PRESCRIPTION SETTINGS (Vital Signs & Dietary Advice toggles)
===================================================== */
router.get("/settings", protect, getPrescriptionSettings);
router.put("/settings", protect, updatePrescriptionSettings);

/* =====================================================
   🩺 COMPLAINTS DROPDOWN & CUSTOM COMPLAINT CREATION
===================================================== */
router.get("/complaints", protect, getComplaints);
router.post("/complaints", protect, createComplaint);

/* =====================================================
   💊 MEDICINES MASTER SEARCH & DROPDOWN
===================================================== */
router.get("/medicines", protect, getAllMedicines);

/* =====================================================
   💉 CLINIC SERVICES & PROCEDURES CATALOG
===================================================== */
router.get("/services", protect, getClinicServices);
router.post("/services", protect, createClinicService);

/* =====================================================
   📋 ILLNESS TEMPLATES (Pre-saved templates e.g. "Fever")
===================================================== */
router.post("/templates", protect, createTemplate);
router.get("/templates", protect, getTemplates);
router.get("/templates/:id", protect, getTemplateById);
router.put("/templates/:id", protect, updateTemplate);
router.delete("/templates/:id", protect, deleteTemplate);

/* =====================================================
   🩺 PRESCRIPTION CRUD
===================================================== */
router.post("/", protect, createPrescription);
router.get("/appointment/:appointmentId", protect, getPrescriptionByAppointment);
router.get("/:id", protect, getPrescriptionById);
router.put("/:id", protect, updatePrescription);
router.delete("/:id", protect, deletePrescription);

module.exports = router;
