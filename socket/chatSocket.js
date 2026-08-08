const jwt =
  require("jsonwebtoken");

module.exports = (io) => {

  const onlineUsers =
    new Map();

  io.use((socket, next) => {

    try {

      const token =
        socket.handshake.auth.token;

      if (!token) {

        return next(
          new Error(
            "No token provided"
          )
        );

      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      socket.user =
        decoded;

      next();

    } catch (error) {

      next(
        new Error(
          "Authentication failed"
        )
      );

    }

  });

  io.on(
    "connection",
    (socket) => {

      console.log(
        "✅ Socket Connected:",
        socket.id
      );

      const userId =
        socket.user.id;

      // ✅ STORE ONLINE USER
      onlineUsers.set(
        userId,
        socket.id
      );

      // ✅ JOIN CHAT ROOM
      socket.on(
        "join_chat",
        (conversationId) => {

          socket.join(
            conversationId
          );

          console.log(
            `👥 Joined Room: ${conversationId}`
          );

        }
      );

      // ✅ SEND MESSAGE
      socket.on(
        "send_message",
        async (data) => {

          console.log(
            "📩 Incoming Message:",
            data
          );

          io.to(
            data.conversationId
          ).emit(
            "receive_message",
            data
          );

        }
      );

      // ✅ TYPING
      socket.on(
        "typing",
        (data) => {

          socket.to(
            data.conversationId
          ).emit(
            "typing",
            data
          );

        }
      );

      // ✅ STOP TYPING
      socket.on(
        "stop_typing",
        (data) => {

          socket.to(
            data.conversationId
          ).emit(
            "stop_typing",
            data
          );

        }
      );

      // ✅ MESSAGE SEEN
      socket.on(
        "message_seen",
        (data) => {

          socket.to(
            data.conversationId
          ).emit(
            "message_seen",
            data
          );

        }
      );

      // ✅ DISCONNECT
      socket.on(
        "disconnect",
        () => {

          console.log(
            "❌ Socket Disconnected"
          );

          onlineUsers.delete(
            userId
          );

        }
      );

    }
  );

};