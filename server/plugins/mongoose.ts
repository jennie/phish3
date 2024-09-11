import { ensureConnection } from "../utils/mongoose";

export default defineNitroPlugin(async (nitroApp) => {
  try {
    await ensureConnection();
    console.log("MongoDB connected via Nitro plugin");
  } catch (error) {
    console.error("Failed to connect to MongoDB in Nitro plugin:", error);
  }
});
