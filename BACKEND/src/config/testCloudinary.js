import cloudinary from "./cloudinaryConfig.js";

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary reachable:", result.status);
  } catch (err) {
    console.error("❌ Cloudinary connection failed:", err.message);
  }
})();