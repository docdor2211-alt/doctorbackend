// controllers/analyticsController.js

const Appointment =
  require(
    "../models/appointmentModel"
  );

const Doctor =
  require(
    "../models/doctorModel"
  );

const DocsidePrescription =
  require(
    "../models/docsidePrescriptionModel"
  );



/* =========================
   📊 PATIENT ANALYTICS
========================= */

exports.getPatientAnalytics =
  async (req, res) => {

    try {

      const doctorId =
        req.doctor._id;



      /* =========================
         TOTAL APPOINTMENTS
      ========================= */

      const totalAppointments =
        await Appointment.countDocuments({

          doctorId,

        });



      /* =========================
         MALE PATIENTS
      ========================= */

      const malePatients =
        await Appointment.countDocuments({

          doctorId,

          gender: "Male",

        });



      /* =========================
         FEMALE PATIENTS
      ========================= */

      const femalePatients =
        await Appointment.countDocuments({

          doctorId,

          gender: "Female",

        });



      /* =========================
         COMPLETED
      ========================= */

      const completedAppointments =
        await Appointment.countDocuments({

          doctorId,

          status: "completed",

        });



      /* =========================
         TOTAL PRESCRIPTIONS
      ========================= */

      const totalPrescriptions =
        await DocsidePrescription.countDocuments({

          doctorId,

        });



      /* =========================
         COMMON SYMPTOMS
      ========================= */

      const symptoms =
        await Appointment.aggregate([

          {
            $match: {
              doctorId:
                req.doctor._id,
            },
          },

          {
            $group: {

              _id: "$reason",

              count: {
                $sum: 1,
              },

            },
          },

          {
            $sort: {
              count: -1,
            },
          },

          {
            $limit: 1,
          },

        ]);



      const topSymptom =
        symptoms.length > 0
          ? symptoms[0]._id
          : "No Data";

      const symptomCount =
        symptoms.length > 0
          ? symptoms[0].count
          : 0;



      /* =========================
         GRAPH DATA
      ========================= */

      const appointments =
        await Appointment.find({

          doctorId,

        }).sort({
          createdAt: 1,
        });



      const totalGraph =
        appointments.map(
          (item, index) => ({

            x: index + 1,

            y: 1,

          })
        );



      const maleGraph =
        appointments

          .filter(
            (item) =>
              item.gender ===
              "Male"
          )

          .map(
            (item, index) => ({

              x: index + 1,

              y: 1,

            })
          );



      const femaleGraph =
        appointments

          .filter(
            (item) =>
              item.gender ===
              "Female"
          )

          .map(
            (item, index) => ({

              x: index + 1,

              y: 1,

            })
          );



      const completedGraph =
        appointments

          .filter(
            (item) =>
              item.status ===
              "completed"
          )

          .map(
            (item, index) => ({

              x: index + 1,

              y: 1,

            })
          );



      /* =========================
         RESPONSE
      ========================= */

      res.status(200).json({

        success: true,

        data: {

          topInsights: [

            {
              title:
                "Appointments",

              subTitle:
                "Total",

              count:
                totalAppointments.toString(),

              sectionName:
                "total",

              color:
                "#2962FF",
            },



            {
              title:
                topSymptom,

              subTitle:
                "Symptoms",

              count:
                symptomCount.toString(),

              sectionName:
                "symptoms",

              color:
                "#FF6B6B",
            },



            {
              title:
                "Completed",

              subTitle:
                "Consultations",

              count:
                completedAppointments.toString(),

              sectionName:
                "completed",

              color:
                "#4CAF50",
            },



            {
              title:
                "Prescriptions",

              subTitle:
                "Generated",

              count:
                totalPrescriptions.toString(),

              sectionName:
                "prescriptions",

              color:
                "#9C27B0",
            },

          ],



          sectionFilters: {

            total: [
              "Last Week",
              "Last Month",
              "Last Year",
            ],



            male: [
              "Last Week",
              "Last Month",
            ],



            female: [
              "Last Week",
              "Last Month",
            ],



            completed: [
              "Last Week",
              "Last Month",
            ],

          },



          graphData: {

            total:
              totalGraph,



            male:
              maleGraph,



            female:
              femaleGraph,



            completed:
              completedGraph,

          },

        },

      });

    } catch (error) {

      console.log(
        "PATIENT ANALYTICS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };/* =========================
   📊 DASHBOARD ANALYTICS
========================= */

exports.getDashboardAnalytics =
  async (req, res) => {

    try {

      const totalAppointments =
        await Appointment.countDocuments({

          doctorId:
            req.doctor._id,

        });

      const completedAppointments =
        await Appointment.countDocuments({

          doctorId:
            req.doctor._id,

          status:
            "completed",

        });

      const cancelledAppointments =
        await Appointment.countDocuments({

          doctorId:
            req.doctor._id,

          status:
            "cancelled",

        });

      res.status(200).json({

        success: true,

        data: {

          totalAppointments,

          completedAppointments,

          cancelledAppointments,

        },

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   📈 APPOINTMENT TREND
========================= */

exports.getAppointmentTrend =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          doctorId:
            req.doctor._id,

        });

      const trend =
        appointments.map(
          (item, index) => ({

            x: index + 1,

            y: 1,

          })
        );

      res.status(200).json({

        success: true,

        data:
          trend,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   🩺 COMMON SYMPTOMS
========================= */

exports.getCommonSymptoms =
  async (req, res) => {

    try {

      const symptoms =
        await Appointment.aggregate([

          {
            $match: {

              doctorId:
                req.doctor._id,

            },
          },

          {
            $group: {

              _id:
                "$reason",

              count: {
                $sum: 1,
              },

            },
          },

        ]);

      res.status(200).json({

        success: true,

        data:
          symptoms,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   💰 EARNINGS ANALYTICS
========================= */

exports.getEarningsAnalytics =
  async (req, res) => {

    try {

      const doctor =
        await Doctor.findById(
          req.doctor._id
        );

      const completedAppointments =
        await Appointment.countDocuments({

          doctorId:
            req.doctor._id,

          status:
            "completed",

        });

      const earnings =
        completedAppointments *
        (doctor?.fees || 0);

      res.status(200).json({

        success: true,

        data: {

          earnings,

        },

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };