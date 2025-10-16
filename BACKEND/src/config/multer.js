// src/config/multer.js
import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Configure dynamic Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folderName = `listings/${req.params.id || "temp"}`;
    return {
      folder: folderName,
      format: file.mimetype.split("/")[1],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "image",
    };
  },
});

// Filter image types
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed!"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter,
});

export default upload;
