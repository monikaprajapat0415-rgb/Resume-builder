import mongoose from "mongoose";

let listenersAdded = false;

// Returns true when connected. On failure it does NOT throw or exit: it logs what to
// check and keeps retrying in the background, so the API answers requests with a clear
// "database not connected" error (see server.js) instead of hanging for ~10 seconds.
const connectDB = async () => {
    if (!listenersAdded) {
        listenersAdded = true;
        mongoose.connection.on("connected", () => console.log("Database connected successfully"));
        mongoose.connection.on("disconnected", () => console.warn("Database disconnected"));
    }

    let mongodbURI = process.env.MONGODB_URI;
    const projectName = 'resume-builder';

    if (!mongodbURI) {
        console.error("MONGODB_URI environment variable is not set (check server/.env)");
        return false;
    }
    if (mongodbURI.endsWith('/')) {
        mongodbURI = mongodbURI.slice(0, -1);
    }

    try {
        await mongoose.connect(`${mongodbURI}/${projectName}`, { serverSelectionTimeoutMS: 8000 });
        return true;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error("  -> Check MONGODB_URI, that your internet/VPN allows it, and (for Atlas) that your current IP is in Network Access. Retrying in 10s...");
        setTimeout(() => { connectDB(); }, 10000);
        return false;
    }
}
export default connectDB;
