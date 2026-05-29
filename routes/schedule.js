import express from "express";
import Appointment from "../models/appointments.model.js";

const scheduleRouter = express.Router();

scheduleRouter.get("/slots/:date", async (req, res) => {
  try {
    const date = req.params.date;

    const appointments =
      await Appointment.find({
        appointmentDate: date,
        status: {
          $ne: "Cancelled",
        },
      });

    const bookedSlots =
      appointments.map(a => a.time);

    const slots = [];

    const startHour = 9;
    const endHour = 18;

    for (
      let hour = startHour;
      hour < endHour;
      hour++
    ) {
      for (
        let minute = 0;
        minute < 60;
        minute += 10
      ) {
        const time =
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        slots.push({
          time,
          booked:
            bookedSlots.includes(time),
        });
      }
    }

    res.json(slots);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default scheduleRouter;
