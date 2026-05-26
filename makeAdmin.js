import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config({ path: '.env.development.local' });

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.log("Please provide an email: node makeAdmin.js <email>");
    process.exit(1);
  }
  
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URI);
    
    const user = await User.findOneAndUpdate(
      { email: email }, 
      { role: 'admin' }, 
      { new: true }
    );
    
    if (user) {
      console.log(`\n✅ Successfully granted ADMIN access to: ${user.email}`);
    } else {
      console.log(`\n❌ User with email ${email} not found.`);
      console.log(`Make sure they have created an account on the frontend first.`);
    }
  } catch (error) {
    console.error("Error connecting to DB:", error.message);
  } finally {
    process.exit(0);
  }
}

makeAdmin();
