// const ChatConversation =
//   require(
//     "../models/chatConversationModel"
//   );

// const ChatMessage =
//   require(
//     "../models/chatMessageModel"
//   );

// const Appointment =
//   require(
//     "../models/appointmentModel"
//   );



// /* =========================
//    ✅ START CHAT
// ========================= */

// exports.startChat =
//   async (req, res) => {

//     try {

//       const {
//         appointmentId
//       } = req.body;



//       const appointment =
//         await Appointment.findById(
//           appointmentId
//         );

//       if (!appointment) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Appointment not found",

//         });

//       }



//       let conversation =
//         await ChatConversation.findOne({

//           appointmentId,

//         });

//       if (!conversation) {

//         conversation =
//           await ChatConversation.create({

//             appointmentId,

//             userId:
//               appointment.userId,

//             doctorId:
//               appointment.doctorId,

//           });

//       }



//       res.status(200).json({

//         success: true,

//         message:
//           "Chat started",

//         data:
//           conversation,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    ✅ SEND MESSAGE
// ========================= */

// exports.sendMessage =
//   async (req, res) => {

//     try {

//       const {
//         conversationId,
//         message,
//       } = req.body;



//       const newMessage =
//         await ChatMessage.create({

//           conversationId,

//           senderId:
//             req.user?._id ||
//             req.doctor?._id,

//           senderType:
//             req.doctor
//               ? "doctor"
//               : "user",

//           message,

//         });



//       await ChatConversation.findByIdAndUpdate(

//         conversationId,

//         {

//           lastMessage:
//             message,

//           lastMessageTime:
//             new Date(),

//         }

//       );



//       res.status(201).json({

//         success: true,

//         message:
//           "Message sent",

//         data:
//           newMessage,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    ✅ GET MESSAGES
// ========================= */

// exports.getMessages =
//   async (req, res) => {

//     try {

//       const messages =
//         await ChatMessage.find({

//           conversationId:
//             req.params.conversationId,

//         }).sort({
//           createdAt: 1,
//         });



//       res.status(200).json({

//         success: true,

//         count:
//           messages.length,

//         data:
//           messages,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };





// /* =========================
//    ✅ GET MY CHATS
// ========================= */

// exports.getMyChats =
//   async (req, res) => {

//     try {

//       let chats;



//       if (req.doctor) {

//         chats =
//           await ChatConversation.find({

//             doctorId:
//               req.doctor._id,

//           })

//             .sort({
//               updatedAt: -1,
//             });

//       } else {

//         chats =
//           await ChatConversation.find({

//             userId:
//               req.user._id,

//           })

//             .sort({
//               updatedAt: -1,
//             });

//       }



//       res.status(200).json({

//         success: true,

//         count:
//           chats.length,

//         data:
//           chats,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



const ChatConversation =
  require(
    "../models/chatConversationModel"
  );

const ChatMessage =
  require(
    "../models/chatMessageModel"
  );

const Appointment =
  require(
    "../models/appointmentModel"
  );

/* =========================
   ✅ START CHAT
========================= */

exports.startChat =
  async (req, res) => {

    try {

      const {
        appointmentId
      } = req.body;

      const appointment =
        await Appointment.findById(
          appointmentId
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }

      let conversation =
        await ChatConversation.findOne({

          appointmentId,

        });

      if (!conversation) {

        conversation =
          await ChatConversation.create({

            appointmentId,

            userId:
              appointment.userId,

            doctorId:
              appointment.doctorId,

          });

      }

      res.status(200).json({

        success: true,

        message:
          "Chat started successfully",

        data:
          conversation,

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
   ✅ SEND MESSAGE
========================= */

exports.sendMessage =
  async (req, res) => {

    try {

      const {

        conversationId,

        message,

        messageType,

        fileUrl,

      } = req.body;

      if (
        !message &&
        !fileUrl
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Message required",

        });

      }

      const conversation =
        await ChatConversation.findById(
          conversationId
        );

      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Conversation not found",

        });

      }

      const senderId =
        req.user?._id ||
        req.doctor?._id;

      const senderType =
        req.doctor
          ? "doctor"
          : "user";

      const newMessage =
        await ChatMessage.create({

          conversationId,

          senderId,

          senderType,

          message:
            message || "",

          messageType:
            messageType || "text",

          fileUrl:
            fileUrl || "",

        });

      conversation.lastMessage =
        message || "📎 File";

      conversation.lastMessageTime =
        new Date();

      if (
        senderType ===
        "doctor"
      ) {

        conversation.unreadUserCount += 1;

      } else {

        conversation.unreadDoctorCount += 1;

      }

      await conversation.save();
      // ✅ SOCKET REALTIME

const io =
  req.app.get("io");

io.to(
  conversationId
).emit(

  "receive_message",

  newMessage

);

      res.status(201).json({

        success: true,

        message:
          "Message sent successfully",

        data:
          newMessage,

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
   ✅ GET MESSAGES
========================= */

exports.getMessages =
  async (req, res) => {

    try {

      const messages =
        await ChatMessage.find({

          conversationId:
            req.params.conversationId,

        })

        .sort({
          createdAt: 1,
        });

      res.status(200).json({

        success: true,

        count:
          messages.length,

        data:
          messages,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



exports.getMyChats =
  async (req, res) => {

    try {

      let chats;

      /* =========================
         ✅ DOCTOR CHATS
      ========================= */

      if (req.doctor) {

        chats =
          await ChatConversation.find({

            doctorId:
              req.doctor._id,

          })

          .sort({
            updatedAt: -1,
          });

      }

      /* =========================
         ✅ USER CHATS
      ========================= */

      else {

        chats =
          await ChatConversation.find({

            userId:
              req.user._id,

          })

          .populate(

            "doctorId",

            "name speciality doctorImagePath"

          )

          .sort({
            updatedAt: -1,
          });

      }

      /* =========================
         ✅ RESPONSE
      ========================= */

      res.status(200).json({

        success: true,

        count:
          chats.length,

        data:
          chats,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   ✅ DELETE CHAT
========================= */

exports.deleteChat =
  async (req, res) => {

    try {

      const conversation =
        await ChatConversation.findById(
          req.params.id
        );

      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:
            "Chat not found",

        });

      }

      await ChatMessage.deleteMany({

        conversationId:
          conversation._id,

      });

      await conversation.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "Chat deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };