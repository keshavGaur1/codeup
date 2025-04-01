import express from "express";
import mongoose from "mongoose";
import cors from "cors";  
import dotenv from "dotenv";
import session from "express-session"; // middleware for user session management
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import path from "path";
import submissionRoutes from './routes/submission.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import fileRoutes from "./routes/file.js";
import chatRoutes from "./routes/chat.js";
import executeRoutes from "./routes/execute.js";
import testWorkshopRoutes from "./routes/testWorkshop.js";
import teacherRoutes from "./routes/teacher.js";
import liveblocksRoutes from "./routes/liveblocks.js";
dotenv.config();
const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Allow necessary headers
}));
app.use(express.json());
app.use(cookieParser());

// Serves static files from the "uploads" directory
// This is where the uploaded files will be stored
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "your_session_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true, // Prevent client-side access to cookies
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/file", fileRoutes);
app.use('/api/student', submissionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/test-workshop", testWorkshopRoutes);
app.use("/api/liveblocks", liveblocksRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/execute", executeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));