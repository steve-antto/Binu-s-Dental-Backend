import express from "express";
import Appointment from "../models/appointments.model.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/slots/:date", async (req, res) => {
  try {
    const date = req.params.date;

    const appointments = await Appointment.find({
      date,
      status: {
        $ne: "cancelled",
      },
    });

    const bookedSlots = appointments.map((a) => a.time);

    const slots = [];

    const generateSlots = (startHour, endHour) => {
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          if (hour === endHour && minute > 0) break;

          const dateObj = new Date();
          dateObj.setHours(hour, minute, 0);

          const formattedTime = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          slots.push({
            time: formattedTime,
            booked: bookedSlots.includes(formattedTime),
          });
        }
      }
    };

    // Morning
    generateSlots(9, 13);

    // Evening
    generateSlots(17, 20);

    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching slots",
    });
  }
});

export default scheduleRouter;
