import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import assignmentsRoutes from "./routes/assignments.routes.js";

dotenv.config();

const app = express();
const PORT =  8000;

// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5175', // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
}))


app.use('/api/auth' , authRouter)
app.use("/api/assignments", assignmentsRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});