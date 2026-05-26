import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from "../config/env.js";
import Doctor from '../models/doctor.model.js';

if(!DB_URI){
    throw new Error('Please define a valid DB_URI environment variable inside .env.<development\\production>.local');
}

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try{
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode`);

        // Check if Doctors collection is empty, and seed if needed
        const count = await Doctor.countDocuments();
        if (count === 0) {
            console.log("Doctors collection is empty. Seeding default doctor profiles...");

            await Doctor.insertMany([
                {
                    name: "Dr. Binu",
                    qualifications: "BDS • Lead Surgeon",
                    bio: "With more than 29 years of experience and thousands of successful smile transformations, Dr. Binu makes advanced dental care comfortable and accessible. Her expertise spans complex root canals, implantology, and aesthetic smile design. She is deeply committed to changing the perception of dental anxiety by ensuring every patient enjoys a gentle, transparent, and completely stress-free treatment journey.",
                    patientsTreated: "200k+",
                    experienceYears: "29+",
                    image: "",
                    specialties: ["Root Canal Specialist", "Dental Implants", "Laser Dentistry", "Cosmetic Dentistry"],
                    consultationFee: 500,
                    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                },
                {
                    name: "Dr. Yogeswari.S",
                    qualifications: "BDS • Assistant Surgeon",
                    bio: "Dr. Yogeswari.S is a highly skilled dental surgeon with over 8 years of clinical experience in restoring oral health and function. She specializes in advanced root canal therapy, dental implants, and cosmetic dentistry, combining technical precision with a patient-first philosophy. Known for her gentle chairside manner, Dr. Yogeswari.S focuses on delivering stress-free, minimally invasive care tailored to each patient's unique needs.",
                    patientsTreated: "100+",
                    experienceYears: "8+",
                    image: "",
                    specialties: ["Root Canal Specialist", "Dental Implants", "Laser Dentistry", "Cosmetic Dentistry"],
                    consultationFee: 500,
                    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                }
            ]);
            console.log("Seeding complete!");
        }
    }
    catch(error){
        console.error('Error connecting to database', error);
        process.exit(1);
    }
}

export default connectToDatabase;
