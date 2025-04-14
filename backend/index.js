import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// App configuration
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    credentials: true
  }
});

// Export io so it can be used in your controllers
export { io };

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Routes
import userRoute from './routes/user.js'
import otpRoute from './routes/otp.js'
import addressRoute from './routes/address.js'
import deviceRoute from './routes/device.js'
import adminRoute from './routes/admin.js'
import authRoute from './routes/auth.js'
import serviceRoute from './routes/service.js'
import issueRoute from './routes/issue.js'
import employeeRoute from './routes/employee.js'
import timeRoute from './routes/time.js'
import leaveRoute from './routes/leave.js'
import twilioRoute from './routes/twilio.js'
import notifyRoute from './routes/notify.js'

app.use('/api/otp', otpRoute)
app.use('/api/user', userRoute)
app.use('/api/device', deviceRoute)
app.use('/api/address', addressRoute)
app.use('/api/admin', adminRoute)
app.use('/api/auth', authRoute)
app.use('/api/service', serviceRoute)
app.use('/api/issue', issueRoute)
app.use('/api/employee', employeeRoute)
app.use('/api/time', timeRoute)
app.use('/api/leave', leaveRoute)
app.use('/api/twilio', twilioRoute)
app.use('/api/notify',notifyRoute)

app.get("/", (req, res) => {
  res.send("Bahut maza aa raha hai 🥳");
});

// Error handler
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || "Something went wrong!";
  return res.status(errStatus).json({
    success: "false",
    status: errStatus,
    message: errMsg,
    stack: err.stack,
  });
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("join_room",(roomName) => {
    console.log(`user joined room ${roomName}`)
    socket.join(roomName)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });

  // You can listen to events from frontend here if needed
});

// Start server
const port = process.env.PORT || 8080;
server.listen(port, () => {
  connectDb();
  console.log(`App is listening on port: ${port}`);
});
