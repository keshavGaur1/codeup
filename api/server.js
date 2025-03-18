import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);




app.use(
  cors({
    origin: `http://localhost:5173`,
    methods: ["GET", "POST", "DELETE", "PUT","OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/leaderboard', leaderboardRoutes);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(5000, () => {
  connect();
  console.log("Backend server is running!");
});
