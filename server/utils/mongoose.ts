import mongoose from "mongoose";
mongoose.set("debug", true);
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
mongoose.connection.on("connecting", () => {
  console.log("Connecting to MongoDB...");
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
let isConnected = false;

export async function ensureConnection() {
  if (isConnected) {
    console.log("Database already connected");
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI ?? "";

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Database connected");

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}
