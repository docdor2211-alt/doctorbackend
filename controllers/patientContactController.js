const PatientContact = require("../models/patientContactModel");

/* =========================
   HELPERS
========================= */

const contactKey = ({ userId, patientName }) => {
  const id = (userId || "").toString().trim();
  if (id) return `user:${id}`;
  return `name:${(patientName || "").toString().trim().toLowerCase()}`;
};

/* =========================
   📇 GET MY CONTACTS
========================= */

exports.getMyContacts = async (req, res) => {
  try {
    const contacts = await PatientContact.find({
      doctorId: req.doctor._id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.log("GET PATIENT CONTACTS ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   🔍 LOOKUP CONTACT
========================= */

exports.lookupContact = async (req, res) => {
  try {
    const { userId, patientName } = req.query;

    if (!userId && !patientName) {
      return res.status(400).json({
        success: false,
        message: "userId or patientName is required",
      });
    }

    const contacts = await PatientContact.find({
      doctorId: req.doctor._id,
      key: {
        $in: [
          contactKey({ userId, patientName }),
          contactKey({ userId: "", patientName }),
        ],
      },
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts[0] || null,
    });
  } catch (error) {
    console.log("LOOKUP PATIENT CONTACT ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   💾 SAVE (UPSERT) CONTACT
========================= */

exports.saveContact = async (req, res) => {
  try {
    const { userId, patientName, mobile, email, address, notes } = req.body;

    if (!patientName || !String(patientName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    const key = contactKey({ userId, patientName });
    const nameKey = contactKey({ userId: "", patientName });

    const payload = {
      doctorId: req.doctor._id,
      key,
      userId: userId ? String(userId) : "",
      patientName: String(patientName).trim(),
      mobile: mobile ? String(mobile).trim() : "",
      email: email ? String(email).trim().toLowerCase() : "",
      address: address ? String(address).trim() : "",
      notes: notes ? String(notes).trim() : "",
    };

    const contact = await PatientContact.findOneAndUpdate(
      { doctorId: req.doctor._id, key },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Keep a name alias so later appointments with a different userId still
    // resolve the same contact card.
    if (nameKey !== key) {
      await PatientContact.findOneAndUpdate(
        { doctorId: req.doctor._id, key: nameKey },
        { ...payload, key: nameKey },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Contact saved successfully",
      data: contact,
    });
  } catch (error) {
    console.log("SAVE PATIENT CONTACT ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   🗑 DELETE CONTACT
========================= */

exports.deleteContact = async (req, res) => {
  try {
    const contact = await PatientContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    if (contact.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await PatientContact.deleteMany({
      doctorId: req.doctor._id,
      $or: [
        { key: contact.key },
        { key: contactKey({ userId: "", patientName: contact.patientName }) },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PATIENT CONTACT ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
