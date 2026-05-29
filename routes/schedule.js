import express from "express";
import Appointment from "../models/appointments.model.js";
import TreatmentSchedule from "../models/treatmentSchedule.model.js";

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

    // Fetch treatment schedules for the current date
    const schedules = await TreatmentSchedule.find({
      "sessions.date": date
    });

    const treatmentBlockedRanges = [];
    schedules.forEach(schedule => {
      schedule.sessions.forEach(session => {
        if (session.date === date) {
          treatmentBlockedRanges.push({
            start: session.startTime,
            end: session.endTime
          });
        }
      });
    });

    const isTimeInRanges = (timeStr) => {
      // timeStr is like "10:00 AM" or "02:30 PM"
      // Convert timeStr to 24-hour format "HH:mm" for comparison
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const formattedTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      return treatmentBlockedRanges.some(range => {
         // Assuming session startTime and endTime are in "HH:mm" 24-hour format
         return formattedTime24 >= range.start && formattedTime24 < range.end;
      });
    };

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
            booked: bookedSlots.includes(formattedTime) || isTimeInRanges(formattedTime),
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
