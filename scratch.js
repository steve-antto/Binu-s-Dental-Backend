import mongoose from "mongoose";
import Appointment from "./models/appointments.model.js";
import dotenv from "dotenv";

dotenv.config({ path: '.env.development.local' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const appts = await Appointment.find();
    console.log("Found appointments:", appts.length);
    console.log(appts.map(a => ({ date: a.date, name: a.patientName })));
    process.exit(0);
  });
