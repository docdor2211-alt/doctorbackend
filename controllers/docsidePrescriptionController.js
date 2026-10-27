const mongoose = require("mongoose");
const DocsidePrescription = require("../models/docsidePrescriptionModel");
const Appointment = require("../models/appointmentModel");
const MedicineItem = require("../models/pharmacyProductModel");
const Complaint = require("../models/complaintModel");
const ClinicService = require("../models/clinicServiceModel");
const IllnessTemplate = require("../models/illnessTemplateModel");
const Doctor = require("../models/doctorModel");

/* =====================================================
   🌱 HELPER SEEDERS (Ensure rich default dropdowns)
===================================================== */

const seedDefaultComplaintsIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const count = await Complaint.countDocuments({ doctorId: null });
    if (count === 0) {
      const defaults = [
        "Fever",
        "Cough & Cold",
        "Headache",
        "Chest Pain",
        "Abdominal Pain",
        "Shortness of Breath",
        "Joint Pain",
        "Back Pain",
        "Skin Rash & Itching",
        "Nausea / Vomiting",
        "Generalized Weakness / Fatigue",
        "Dizziness",
        "Loss of Appetite",
        "Sore Throat",
        "Loose Motion / Diarrhea",
      ];
      await Complaint.insertMany(
        defaults.map((name) => ({
          name,
          doctorId: null,
          isCustom: false,
          category: "General",
        })),
        { ordered: false }
      ).catch(() => {});
    }
  } catch (err) {
    console.error("Complaint seed error:", err.message);
  }
};

const seedDefaultServicesIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const count = await ClinicService.countDocuments({ doctorId: null });
    if (count === 0) {
      const defaults = [
        { serviceName: "Laser Hair Removal", defaultPrice: 3500, category: "Dermatology" },
        { serviceName: "PRP Hair Treatment", defaultPrice: 4000, category: "Dermatology" },
        { serviceName: "Chemical Peel", defaultPrice: 2000, category: "Cosmetology" },
        { serviceName: "Minor Wound Dressing", defaultPrice: 500, category: "General Procedure" },
        { serviceName: "Skin Tag / Wart Removal", defaultPrice: 1500, category: "Minor Surgery" },
        { serviceName: "Nebulization Session", defaultPrice: 400, category: "Respiratory" },
        { serviceName: "Stitching / Minor Suturing", defaultPrice: 1200, category: "Minor Surgery" },
      ];
      await ClinicService.insertMany(
        defaults.map((s) => ({
          ...s,
          doctorId: null,
          isActive: true,
        })),
        { ordered: false }
      ).catch(() => {});
    }
  } catch (err) {
    console.error("Services seed error:", err.message);
  }
};

const seedDefaultTemplatesIfEmpty = async (doctorId) => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const query = doctorId ? { $or: [{ doctorId: null }, { doctorId }] } : { doctorId: null };
    const count = await IllnessTemplate.countDocuments(query);
    if (count === 0) {
      const defaultTemplate = {
        doctorId: doctorId || null,
        templateName: "Fever",
        complaints: ["High grade fever", "Headache", "Body ache", "Weakness"],
        diagnosis: "Acute Viral Fever",
        patientHistory: "Patient developed acute onset of fever with chills since 2 days.",
        examinationFindings: "Temperature: 101.4 F, Pulse: 88 bpm. Throat mildly congested.",
        clinicalNotes: "Patient advised proper hydration, paracetamol as prescribed, and rest.",
        medicines: [
          {
            medicineName: "Paracetamol 650mg",
            dosage: "1 Tablet",
            timeSlots: { morning: true, noon: false, evening: false, night: true, alternateDay: false },
            slots: ["Morning", "Night"],
            instruction: "After Meal",
            duration: "5 Days",
            frequency: "Twice daily",
          },
          {
            medicineName: "Cetirizine 10mg",
            dosage: "1 Tablet",
            timeSlots: { morning: false, noon: false, evening: false, night: true, alternateDay: false },
            slots: ["Night"],
            instruction: "After Meal",
            duration: "3 Days",
            frequency: "Once at night",
          },
          {
            medicineName: "Pantoprazole 40mg",
            dosage: "1 Capsule",
            timeSlots: { morning: true, noon: false, evening: false, night: false, alternateDay: false },
            slots: ["Morning"],
            instruction: "Before Meal",
            duration: "5 Days",
            frequency: "Empty stomach morning",
          },
        ],
        dietaryAdvice: {
          itemsToEat: ["Warm water", "Fresh fruit juices", "Light khichdi", "Vegetable soups"],
          itemsToAvoid: ["Cold drinks", "Oily and spicy foods", "Junk food"],
          lifestyleAdvice: "Adequate bed rest, avoid intense physical exertion, check temperature twice daily.",
          notes: "Stay well hydrated with electrolytes.",
        },
        labInvestigations: ["Complete Blood Count (CBC)", "Widal Test (if fever > 4 days)"],
        services: [],
      };
      await IllnessTemplate.create(defaultTemplate);
    }
  } catch (err) {
    console.error("Template seed error:", err.message);
  }
};

/* =====================================================
   💊 FORMAT MEDICINES HELPER
===================================================== */
const formatMedicinesInput = (medicines = []) => {
  return medicines.map((item) => {
    const timeSlots = item.timeSlots || {
      morning: Boolean(item.morning),
      noon: Boolean(item.noon),
      evening: Boolean(item.evening),
      night: Boolean(item.night),
      alternateDay: Boolean(item.alternateDay),
    };

    const slots =
      item.slots && Array.isArray(item.slots) && item.slots.length > 0
        ? item.slots
        : [
            timeSlots.morning ? "Morning" : null,
            timeSlots.noon ? "Noon" : null,
            timeSlots.evening ? "Evening" : null,
            timeSlots.night ? "Night" : null,
            timeSlots.alternateDay ? "Alternate Day" : null,
          ].filter(Boolean);

    return {
      productId: item.productId || null,
      medicineName: item.medicineName || item.name || item.productTitle || "",
      dosage: item.dosage || "",
      timeSlots,
      slots,
      instruction: item.instruction || item.applicationInstruction || "After Meal",
      duration: item.duration || "",
      frequency: item.frequency || (slots.length > 0 ? slots.join(" - ") : ""),
      instructions: item.instructions || item.instruction || "",
    };
  });
};

/* =====================================================
   💉 FORMAT SERVICES HELPER
===================================================== */
const formatServicesInput = (services = []) => {
  return services.map((s) => {
    const price = Number(s.price || s.defaultPrice || 0);
    const discount = Number(s.discount || 0);
    const discountType = s.discountType === "percentage" ? "percentage" : "fixed";

    let netAmount = s.netAmount;
    if (netAmount === undefined || netAmount === null) {
      if (discountType === "percentage") {
        netAmount = Math.max(0, price - (price * discount) / 100);
      } else {
        netAmount = Math.max(0, price - discount);
      }
    }

    return {
      serviceId: s.serviceId || null,
      serviceName: s.serviceName || "",
      sessionNumber: Number(s.sessionNumber || 1),
      price,
      discount,
      discountType,
      netAmount: Number(netAmount),
      notes: s.notes || "",
    };
  });
};

/* =====================================================
   ✅ 1. CREATE PRESCRIPTION
===================================================== */
const createPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      vitalSigns = {},
      complaints = [],
      chiefComplaints,
      patientHistory = "",
      diagnosis = "",
      provisionalDiagnosis = "",
      examinationFindings = "",
      clinicalNotes = "",
      medicines = [],
      services = [],
      dietaryAdvice = {},
      dietaryInstructions = "",
      symptoms = [],
      labInvestigations = [],
      doctorsAdvice = "",
      pdfUrl = "",
    } = req.body;

    // Check appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Unify complaints
    let finalComplaints = Array.isArray(complaints) && complaints.length > 0 ? complaints : [];
    if (finalComplaints.length === 0 && chiefComplaints) {
      if (typeof chiefComplaints === "string") {
        finalComplaints = chiefComplaints.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    const finalChiefComplaints = chiefComplaints || finalComplaints.join(", ");

    // Unify diagnosis
    const finalDiagnosis = diagnosis || provisionalDiagnosis || "";

    // Unify dietary advice
    const finalDietaryAdvice = {
      itemsToEat: dietaryAdvice.itemsToEat || [],
      itemsToAvoid: dietaryAdvice.itemsToAvoid || [],
      lifestyleAdvice: dietaryAdvice.lifestyleAdvice || dietaryAdvice.lifestyle || "",
      notes: dietaryAdvice.notes || dietaryInstructions || "",
    };
    const finalDietaryInstructions =
      dietaryInstructions ||
      [
        finalDietaryAdvice.itemsToEat.length ? `Eat: ${finalDietaryAdvice.itemsToEat.join(", ")}` : "",
        finalDietaryAdvice.itemsToAvoid.length ? `Avoid: ${finalDietaryAdvice.itemsToAvoid.join(", ")}` : "",
        finalDietaryAdvice.lifestyleAdvice ? `Lifestyle: ${finalDietaryAdvice.lifestyleAdvice}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

    // Format medicines with timeSlots & instruction
    const formattedMedicines = formatMedicinesInput(medicines);

    // Format billable clinic services & procedures
    const formattedServices = formatServicesInput(services);

    // Format vital signs (Weight, Temperature, Pulse, Blood Pressure, SpO2)
    const finalVitals = {
      weight: vitalSigns.weight || req.body.weight || appointment.weight || "",
      temperature: vitalSigns.temperature || req.body.temperature || appointment.temperature || "",
      pulse: vitalSigns.pulse || req.body.pulse || appointment.pulse || "",
      bloodPressure: vitalSigns.bloodPressure || req.body.bloodPressure || appointment.bloodPressure || "",
      spO2: vitalSigns.spO2 || req.body.spO2 || req.body.spo2 || appointment.spO2 || "",
    };

    // Update appointment vitals if provided
    let appointmentUpdated = false;
    if (finalVitals.weight && !appointment.weight) {
      appointment.weight = finalVitals.weight;
      appointmentUpdated = true;
    }
    if (finalVitals.temperature && !appointment.temperature) {
      appointment.temperature = finalVitals.temperature;
      appointmentUpdated = true;
    }
    if (finalVitals.pulse && !appointment.pulse) {
      appointment.pulse = finalVitals.pulse;
      appointmentUpdated = true;
    }
    if (finalVitals.bloodPressure && !appointment.bloodPressure) {
      appointment.bloodPressure = finalVitals.bloodPressure;
      appointmentUpdated = true;
    }
    if (finalVitals.spO2 && !appointment.spO2) {
      appointment.spO2 = finalVitals.spO2;
      appointmentUpdated = true;
    }
    if (appointmentUpdated) {
      await appointment.save();
    }

    // Create prescription record
    const prescription = await DocsidePrescription.create({
      appointmentId,
      doctorId: req.doctor._id,
      userId: appointment.userId,
      vitalSigns: finalVitals,
      complaints: finalComplaints,
      chiefComplaints: finalChiefComplaints,
      patientHistory,
      diagnosis: finalDiagnosis,
      provisionalDiagnosis: finalDiagnosis,
      examinationFindings,
      clinicalNotes,
      medicines: formattedMedicines,
      services: formattedServices,
      dietaryAdvice: finalDietaryAdvice,
      dietaryInstructions: finalDietaryInstructions,
      symptoms,
      labInvestigations,
      doctorsAdvice,
      pdfUrl,
    });

    const populatedPrescription = await DocsidePrescription.findById(prescription._id)
      .populate("doctorId", "name email speciality doctorImagePath clinicName")
      .populate("userId", "fullname email phone")
      .populate("symptoms", "name image color")
      .populate("medicines.productId", "productTitle name brand category mrp stock image");

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: populatedPrescription,
    });
  } catch (error) {
    console.error("Create Prescription Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 2. GET PRESCRIPTION BY APPOINTMENT
===================================================== */
const getPrescriptionByAppointment = async (req, res) => {
  try {
    const prescription = await DocsidePrescription.findOne({
      appointmentId: req.params.appointmentId,
    })
      .populate("doctorId", "name email speciality doctorImagePath clinicName")
      .populate("userId", "fullname email phone")
      .populate("symptoms", "name image color")
      .populate("medicines.productId", "productTitle name brand category mrp stock image");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error("Get Prescription By Appointment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 3. GET SINGLE PRESCRIPTION BY ID
===================================================== */
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await DocsidePrescription.findById(req.params.id)
      .populate("doctorId", "name email speciality doctorImagePath clinicName")
      .populate("userId", "fullname email phone")
      .populate("symptoms", "name image color")
      .populate("medicines.productId", "productTitle name brand category mrp stock image");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 4. UPDATE PRESCRIPTION
===================================================== */
const updatePrescription = async (req, res) => {
  try {
    const prescription = await DocsidePrescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    // Format updates
    if (req.body.medicines) {
      req.body.medicines = formatMedicinesInput(req.body.medicines);
    }
    if (req.body.services) {
      req.body.services = formatServicesInput(req.body.services);
    }
    if (req.body.diagnosis) {
      req.body.provisionalDiagnosis = req.body.diagnosis;
    } else if (req.body.provisionalDiagnosis) {
      req.body.diagnosis = req.body.provisionalDiagnosis;
    }
    if (req.body.complaints && Array.isArray(req.body.complaints)) {
      req.body.chiefComplaints = req.body.complaints.join(", ");
    }

    // Sync vitals to appointment if passed
    if (req.body.vitalSigns && prescription.appointmentId) {
      const appt = await Appointment.findById(prescription.appointmentId);
      if (appt) {
        if (req.body.vitalSigns.weight !== undefined) appt.weight = req.body.vitalSigns.weight;
        if (req.body.vitalSigns.temperature !== undefined) appt.temperature = req.body.vitalSigns.temperature;
        if (req.body.vitalSigns.pulse !== undefined) appt.pulse = req.body.vitalSigns.pulse;
        if (req.body.vitalSigns.bloodPressure !== undefined) appt.bloodPressure = req.body.vitalSigns.bloodPressure;
        if (req.body.vitalSigns.spO2 !== undefined) appt.spO2 = req.body.vitalSigns.spO2;
        await appt.save();
      }
    }

    Object.assign(prescription, req.body);
    await prescription.save();

    const updated = await DocsidePrescription.findById(prescription._id)
      .populate("doctorId", "name email speciality doctorImagePath clinicName")
      .populate("userId", "fullname email phone")
      .populate("symptoms", "name image color")
      .populate("medicines.productId", "productTitle name brand category mrp stock image");

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 5. DELETE PRESCRIPTION
===================================================== */
const deletePrescription = async (req, res) => {
  try {
    const prescription = await DocsidePrescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    await prescription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 6. MEDICINES MASTER / SEARCH DROPDOWN
===================================================== */
const getAllMedicines = async (req, res) => {
  try {
    const { search = "", limit = 50 } = req.query;

    let query = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query = {
        $or: [
          { productTitle: regex },
          { name: regex },
          { brand: regex },
          { category: regex },
        ],
      };
    }

    const medicines = await MedicineItem.find(query)
      .limit(Number(limit))
      .select("_id productTitle name brand category mrp price stock image description");

    const formattedMedicines = medicines.map((m) => ({
      _id: m._id,
      name: m.productTitle || m.name || "Medicine",
      productTitle: m.productTitle || m.name || "Medicine",
      brand: m.brand || "",
      category: m.category || "",
      mrp: m.mrp || m.price || 0,
      price: m.price || m.mrp || 0,
      stock: m.stock || 0,
      image: m.image || "",
    }));

    res.status(200).json({
      success: true,
      count: formattedMedicines.length,
      data: formattedMedicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 7. COMPLAINTS: GET DROPDOWN
===================================================== */
const getComplaints = async (req, res) => {
  try {
    await seedDefaultComplaintsIfEmpty();

    const { search = "" } = req.query;
    const doctorId = req.doctor ? req.doctor._id : null;

    let query = {
      $or: [{ doctorId: null }, { doctorId: doctorId }],
      isActive: true,
    };

    if (search.trim()) {
      query.name = new RegExp(search.trim(), "i");
    }

    const complaints = await Complaint.find(query)
      .sort({ isCustom: 1, name: 1 })
      .select("_id name category isCustom doctorId");

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 8. COMPLAINTS: CREATE CUSTOM ON THE FLY
===================================================== */
const createComplaint = async (req, res) => {
  try {
    const { name, category = "Custom" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Complaint name is required",
      });
    }

    const trimmedName = name.trim();

    // Check if already exists for this doctor or predefined
    let existing = await Complaint.findOne({
      name: new RegExp(`^${trimmedName}$`, "i"),
      $or: [{ doctorId: null }, { doctorId: req.doctor._id }],
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Complaint already exists",
        data: existing,
      });
    }

    const newComplaint = await Complaint.create({
      name: trimmedName,
      doctorId: req.doctor._id,
      category,
      isCustom: true,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Custom complaint created successfully",
      data: newComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 9. SERVICES & PROCEDURES: GET CATALOG
===================================================== */
const getClinicServices = async (req, res) => {
  try {
    await seedDefaultServicesIfEmpty();

    const { search = "" } = req.query;
    const doctorId = req.doctor ? req.doctor._id : null;

    let query = {
      $or: [{ doctorId: null }, { doctorId: doctorId }],
      isActive: true,
    };

    if (search.trim()) {
      query.serviceName = new RegExp(search.trim(), "i");
    }

    const services = await ClinicService.find(query)
      .sort({ serviceName: 1 })
      .select("_id serviceName category defaultPrice description doctorId");

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 10. SERVICES & PROCEDURES: ADD NEW CLINIC SERVICE
===================================================== */
const createClinicService = async (req, res) => {
  try {
    const { serviceName, defaultPrice = 0, category = "General Procedure", description = "" } = req.body;

    if (!serviceName || !serviceName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    const trimmedName = serviceName.trim();

    let existing = await ClinicService.findOne({
      serviceName: new RegExp(`^${trimmedName}$`, "i"),
      $or: [{ doctorId: null }, { doctorId: req.doctor._id }],
    });

    if (existing) {
      existing.defaultPrice = defaultPrice;
      if (description) existing.description = description;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: "Clinic service updated",
        data: existing,
      });
    }

    const service = await ClinicService.create({
      doctorId: req.doctor._id,
      serviceName: trimmedName,
      defaultPrice: Number(defaultPrice),
      category,
      description,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Clinic service added successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 11. ILLNESS TEMPLATES: CREATE TEMPLATE
===================================================== */
const createTemplate = async (req, res) => {
  try {
    const {
      templateName,
      complaints = [],
      diagnosis = "",
      patientHistory = "",
      examinationFindings = "",
      clinicalNotes = "",
      medicines = [],
      services = [],
      dietaryAdvice = {},
      labInvestigations = [],
    } = req.body;

    if (!templateName || !templateName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Template name is required (e.g., 'Fever')",
      });
    }

    const trimmedName = templateName.trim();

    // Check existing
    const existing = await IllnessTemplate.findOne({
      templateName: new RegExp(`^${trimmedName}$`, "i"),
      doctorId: req.doctor._id,
    });

    const formattedMedicines = formatMedicinesInput(medicines);
    const formattedServices = formatServicesInput(services);

    if (existing) {
      existing.complaints = complaints;
      existing.diagnosis = diagnosis;
      existing.patientHistory = patientHistory;
      existing.examinationFindings = examinationFindings;
      existing.clinicalNotes = clinicalNotes;
      existing.medicines = formattedMedicines;
      existing.services = formattedServices;
      existing.dietaryAdvice = dietaryAdvice;
      existing.labInvestigations = labInvestigations;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Illness template updated successfully",
        data: existing,
      });
    }

    const template = await IllnessTemplate.create({
      doctorId: req.doctor._id,
      templateName: trimmedName,
      complaints,
      diagnosis,
      patientHistory,
      examinationFindings,
      clinicalNotes,
      medicines: formattedMedicines,
      services: formattedServices,
      dietaryAdvice,
      labInvestigations,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Illness template created successfully",
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 12. ILLNESS TEMPLATES: GET ALL TEMPLATES
===================================================== */
const getTemplates = async (req, res) => {
  try {
    const doctorId = req.doctor ? req.doctor._id : null;
    await seedDefaultTemplatesIfEmpty(doctorId);

    const templates = await IllnessTemplate.find({
      $or: [{ doctorId: null }, { doctorId }],
      isActive: true,
    }).sort({ templateName: 1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 13. ILLNESS TEMPLATES: GET TEMPLATE BY ID (AUTO-POPULATE)
===================================================== */
const getTemplateById = async (req, res) => {
  try {
    const template = await IllnessTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 14. ILLNESS TEMPLATES: UPDATE TEMPLATE
===================================================== */
const updateTemplate = async (req, res) => {
  try {
    const template = await IllnessTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    if (req.body.medicines) {
      req.body.medicines = formatMedicinesInput(req.body.medicines);
    }
    if (req.body.services) {
      req.body.services = formatServicesInput(req.body.services);
    }

    Object.assign(template, req.body);
    await template.save();

    res.status(200).json({
      success: true,
      message: "Illness template updated successfully",
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 15. ILLNESS TEMPLATES: DELETE TEMPLATE
===================================================== */
const deleteTemplate = async (req, res) => {
  try {
    const template = await IllnessTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   ✅ 16. PRESCRIPTION & CLINIC SETTINGS
===================================================== */
const getPrescriptionSettings = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id).select(
      "consultationPricing appointmentLength newAppointmentThreshold clinicBranding prescriptionSettings clinicName address"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const settings = {
      isVitalSignsEnabled: doctor.prescriptionSettings?.isVitalSignsEnabled ?? true,
      isDietaryAdviceEnabled: doctor.prescriptionSettings?.isDietaryAdviceEnabled ?? true,
      consultationPricing: {
        newConsultationFee: doctor.consultationPricing?.newConsultationFee ?? 500,
        oldConsultationFee: doctor.consultationPricing?.oldConsultationFee ?? 300,
      },
      appointmentLength: doctor.appointmentLength ?? 15,
      newAppointmentThreshold: doctor.newAppointmentThreshold ?? 30,
      clinicBranding: {
        logo: doctor.clinicBranding?.logo ?? "",
        header: doctor.clinicBranding?.header ?? "",
        footer: doctor.clinicBranding?.footer ?? "",
      },
    };

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePrescriptionSettings = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const {
      isVitalSignsEnabled,
      isDietaryAdviceEnabled,
      newConsultationFee,
      oldConsultationFee,
      appointmentLength,
      newAppointmentThreshold,
      logo,
      header,
      footer,
    } = req.body;

    if (!doctor.prescriptionSettings) {
      doctor.prescriptionSettings = { isVitalSignsEnabled: true, isDietaryAdviceEnabled: true };
    }
    if (isVitalSignsEnabled !== undefined) {
      doctor.prescriptionSettings.isVitalSignsEnabled = Boolean(isVitalSignsEnabled);
    }
    if (isDietaryAdviceEnabled !== undefined) {
      doctor.prescriptionSettings.isDietaryAdviceEnabled = Boolean(isDietaryAdviceEnabled);
    }

    if (!doctor.consultationPricing) {
      doctor.consultationPricing = { newConsultationFee: 500, oldConsultationFee: 300 };
    }
    if (newConsultationFee !== undefined) {
      doctor.consultationPricing.newConsultationFee = Number(newConsultationFee);
      doctor.fees = Number(newConsultationFee);
    }
    if (oldConsultationFee !== undefined) {
      doctor.consultationPricing.oldConsultationFee = Number(oldConsultationFee);
    }

    if (appointmentLength !== undefined) {
      doctor.appointmentLength = Number(appointmentLength);
    }
    if (newAppointmentThreshold !== undefined) {
      doctor.newAppointmentThreshold = Number(newAppointmentThreshold);
    }

    if (!doctor.clinicBranding) {
      doctor.clinicBranding = { logo: "", header: "", footer: "" };
    }
    if (logo !== undefined) doctor.clinicBranding.logo = logo;
    if (header !== undefined) doctor.clinicBranding.header = header;
    if (footer !== undefined) doctor.clinicBranding.footer = footer;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Prescription and clinic settings updated successfully",
      data: {
        isVitalSignsEnabled: doctor.prescriptionSettings.isVitalSignsEnabled,
        isDietaryAdviceEnabled: doctor.prescriptionSettings.isDietaryAdviceEnabled,
        consultationPricing: doctor.consultationPricing,
        appointmentLength: doctor.appointmentLength,
        newAppointmentThreshold: doctor.newAppointmentThreshold,
        clinicBranding: doctor.clinicBranding,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getAllMedicines,
  getPrescriptionByAppointment,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  // Complaints
  getComplaints,
  createComplaint,
  // Services & Procedures
  getClinicServices,
  createClinicService,
  // Illness Templates
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  // Settings
  getPrescriptionSettings,
  updatePrescriptionSettings,
};
