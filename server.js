

const express =
  require("express");

const cors =
  require("cors");

const dotenv =
  require("dotenv");

const path =
  require("path");

const http =
  require("http");

const { Server } =
  require("socket.io");
  



/* =========================
   DATABASE
========================= */

const connectDB =
  require("./config/db");



/* =========================
   CONFIG
========================= */

dotenv.config();

connectDB();



/* =========================
   APP
========================= */

const app =
  express();



/* =========================
   HTTP SERVER
========================= */

const server =
  http.createServer(app);



/* =========================
   SOCKET.IO
========================= */

const io =
  new Server(server, {

    cors: {
      origin: "*",
    },

  });
  /* =========================
   STORE SOCKET.IO
========================= */

app.set("io", io);



/* =========================
   SOCKET CONNECTION
========================= */

io.on(
  "connection",

  (socket) => {

    console.log(
      "✅ Socket Connected =>",
      socket.id
    );



    /* =========================
       JOIN CHAT ROOM
    ========================= */

    socket.on(

      "join_chat",

      (conversationId) => {

        socket.join(
          conversationId
        );

        console.log(
          "✅ Joined Room =>",
          conversationId
        );

      }
    );



    /* =========================
       SEND MESSAGE
    ========================= */

    socket.on(

      "send_message",

      async (data) => {

        io.to(
          data.conversationId
        ).emit(

          "receive_message",

          data
        );

      }
    );



    /* =========================
       TYPING
    ========================= */

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



    /* =========================
       STOP TYPING
    ========================= */

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



    /* =========================
       DISCONNECT
    ========================= */

    socket.on(
      "disconnect",

      () => {

        console.log(
          "❌ Socket Disconnected =>",
          socket.id
        );

      }
    );

  }
);





/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);





/* =========================
   STATIC FOLDER
========================= */

app.use(
  "/uploads",

  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);





/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {

  res.send(
    "API Running..."
  );

});





/* =========================
   ROUTES
========================= */



// ✅ DOCTORS
app.use(
  "/api/doctors",

  require(
    "./routes/doctorRoutes"
  )
);
// ✅ RECEPTIONS
// app.use(

//   "/api/receptions",

//   require(
//     "./routes/receptionRoutes"
//   )

// );



// ✅ PRESCRIPTIONS
app.use(
  "/api/prescriptions",

  require(
    "./routes/prescriptionRoutes"
  )
);



// ✅ APPOINTMENTS
app.use(
  "/api/appointments",

  require(
    "./routes/appointmentRoutes"
  )
);



// ✅ DOCSIDE PRESCRIPTIONS
app.use(
  "/api/prescriptionsss",

  require(
    "./routes/docsidePrescriptionRoutes"
  )
);



// ✅ SCHEDULES
app.use(
  "/api/schedules",

  require(
    "./routes/doctorScheduleRoutes"
  )
);



// ✅ ANALYTICS
app.use(
  "/api/analytics",

  require(
    "./routes/analyticsRoutes"
  )
);



// ✅ CHAT
app.use(
  "/api/chat",

  require(
    "./routes/chatRoutes"
  )
);
app.use(
  "/api/video-call",
  require(
    "./routes/videoCallRoutes"
  )
);
app.use(

  "/api/report-images",

  require(
    "./routes/reportImageRoutes"
  )

);
app.use(

  "/api/stories",

  require(
    "./routes/storyRoutes"
  )

);
const patientCaseRoutes = require( "./routes/patientCaseRoutes" );


app.use( "/api/patient-case", patientCaseRoutes );


const historyRoutes =
  require("./routes/historyRoutes");

app.use(
  "/api/history",
  historyRoutes
);


/* =========================
   INVALID ROUTE
========================= */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message:
      "Route not found",

  });

});





/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 7001;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});