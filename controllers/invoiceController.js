const Invoice = require("../models/invoiceModel");

/* =========================
   HELPERS
========================= */

const normalizeDate = (value) => {
  if (!value) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  }

  const raw = String(value);
  // Full ISO strings -> take the date part.
  if (raw.includes("T")) return raw.split("T")[0];
  return raw;
};

const nextInvoiceNo = async (doctorId) => {
  const count = await Invoice.countDocuments({ doctorId });
  return `INV-${9000 + count + 1}`;
};

/* =========================
   ✅ CREATE INVOICE
========================= */

exports.createInvoice = async (req, res) => {
  try {
    const {
      patientName,
      patientId,
      appointmentId,
      description,
      items,
      amount,
      paymentMode,
      status,
      isPaid,
      notes,
      date,
    } = req.body;

    const parsedAmount = Number(amount);

    if (!patientName || !String(patientName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid amount is required",
      });
    }

    const invoiceNo = await nextInvoiceNo(req.doctor._id);
    const paid = status ? status === "Paid" : Boolean(isPaid);

    const invoice = await Invoice.create({
      doctorId: req.doctor._id,
      invoiceNo,
      patientName: String(patientName).trim(),
      patientId: patientId ? String(patientId) : "",
      appointmentId: appointmentId ? String(appointmentId) : "",
      description: description ? String(description) : "",
      items: Array.isArray(items)
        ? items.map((item) => ({
            name: item?.name ? String(item.name) : "",
            quantity: Number(item?.quantity) || 1,
            price: Number(item?.price) || 0,
          }))
        : [],
      amount: parsedAmount,
      paymentMode: paymentMode || "Cash",
      status: paid ? "Paid" : status === "Cancelled" ? "Cancelled" : "Pending",
      notes: notes ? String(notes) : "",
      invoiceDate: normalizeDate(date),
      paidAt: paid ? new Date() : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.log("CREATE INVOICE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   📄 GET MY INVOICES
========================= */

exports.getMyInvoices = async (req, res) => {
  try {
    const { status, search, limit } = req.query;

    const query = { doctorId: req.doctor._id };

    if (status && status !== "All") {
      query.status = status;
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      query.$or = [
        { patientName: { $regex: term, $options: "i" } },
        { invoiceNo: { $regex: term, $options: "i" } },
        { patientId: { $regex: term, $options: "i" } },
      ];
    }

    const max = Math.min(Number(limit) || 200, 500);

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .limit(max);

    const paid = invoices
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const pending = invoices
      .filter((item) => item.status === "Pending")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    res.status(200).json({
      success: true,
      count: invoices.length,
      summary: {
        total: paid + pending,
        paid,
        pending,
      },
      data: invoices,
    });
  } catch (error) {
    console.log("GET INVOICES ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   📄 GET SINGLE INVOICE
========================= */

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.log("GET INVOICE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ✏️ UPDATE INVOICE
========================= */

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      patientName,
      description,
      items,
      amount,
      paymentMode,
      status,
      notes,
      date,
    } = req.body;

    if (patientName !== undefined) invoice.patientName = patientName;
    if (description !== undefined) invoice.description = description;
    if (Array.isArray(items)) {
      invoice.items = items.map((item) => ({
        name: item?.name ? String(item.name) : "",
        quantity: Number(item?.quantity) || 1,
        price: Number(item?.price) || 0,
      }));
    }
    if (amount !== undefined) invoice.amount = Number(amount);
    if (paymentMode !== undefined) invoice.paymentMode = paymentMode;
    if (notes !== undefined) invoice.notes = notes;
    if (date !== undefined) invoice.invoiceDate = normalizeDate(date);

    if (status !== undefined) {
      invoice.status = status;
      if (status === "Paid") {
        invoice.paidAt = invoice.paidAt || new Date();
      } else {
        invoice.paidAt = undefined;
      }
    }

    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    console.log("UPDATE INVOICE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   🗑 DELETE INVOICE
========================= */

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.log("DELETE INVOICE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
