import express from 'express';
import cors from 'cors';

import connectToDatabase from "./database/mongodb.js";
import { errorHandler } from "./middleware/errorhandler.js";

// Import all routes
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import patientsRouter from "./routes/patients.js";
import appointmentsRouter from "./routes/appointments.js";
import treatmentRouter from "./routes/treatments.js";
import invoicesRouter from "./routes/invoices.js";
import billingRouter from "./routes/billing.js";
import remainderRouter from "./routes/reminders.js";
import doctorsRouter from "./routes/doctors.js";
import dashboardRouter from "./routes/dashboard.js";
import documentsRouter from "./routes/documents.js";
import reportRouter from "./routes/reports.js";
import medicalRouter from "./routes/medical.js";
import contactRouter from "./routes/contact.js";
import scheduleRouter from "./routes/schedule.js";

const app = express();

// 1. Global Middleware
const allowedOrigins = [
  "http://localhost:5173",

  // Old Vercel frontend
  "https://binu-s-dental-frontend.vercel.app",

  // Custom domain
  "https://drbinusclinic.com",

  // WWW version
  "https://www.drbinusclinic.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);
app.use(express.json()); // Essential for parsing incoming JSON bodies (req.body)
app.use(express.urlencoded({ extended: true }));


app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/admin`, adminRouter);
app.use(`/api/v1/patients`, patientsRouter);
app.use(`/api/v1/appointments`, appointmentsRouter);
app.use(`/api/v1/treatment`, treatmentRouter);
app.use(`/api/v1/invoices`, invoicesRouter);
app.use(`/api/v1/billing`, billingRouter);
app.use(`/api/v1/remainders`, remainderRouter);
app.use(`/api/v1/doctors`, doctorsRouter);
app.use(`/api/v1/dashboard`, dashboardRouter);
app.use(`/api/v1/documents`, documentsRouter);
app.use(`/api/v1/report`, reportRouter);
app.use(`/api/v1/medical`, medicalRouter);
app.use(`/api/medical`, medicalRouter);
app.use(`/api/v1/contact`, contactRouter);
app.use("/api/v1/schedule", scheduleRouter);

// Core base route
app.get('/', (req, res) => {
    res.send("Welcome to Binu's Dental Booking API");
});

// 3. Fallback for non-existent routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'API Route not found' });
});

// 4. Global Error Handler (Must be placed AFTER all routes and middleware)
app.use(errorHandler);

// Connect to database (runs on cold start for Vercel, on boot for local)
connectToDatabase().catch((err) => {
    console.error('Failed to connect to database:', err);
});

// Local development: start the server. Vercel handles this automatically.
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 4500;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;

