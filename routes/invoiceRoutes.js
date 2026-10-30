const express = require("express");

const router = express.Router();

const controller = require("../controllers/invoiceController");

const { protect } = require("../middleware/authMiddleware");

/* =========================
   👨‍⚕️ DOCTOR INVOICES
========================= */

// ✅ CREATE INVOICE
router.post("/", protect, controller.createInvoice);

// ✅ GET MY INVOICES
router.get("/my", protect, controller.getMyInvoices);

// ✅ GET SINGLE INVOICE
router.get("/:id", protect, controller.getInvoiceById);

// ✅ UPDATE INVOICE
router.put("/:id", protect, controller.updateInvoice);

// ✅ DELETE INVOICE
router.delete("/:id", protect, controller.deleteInvoice);

module.exports = router;
