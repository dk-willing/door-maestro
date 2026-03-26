// upload.js
const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // your v2 config

const storage = multer.memoryStorage(); // buffer the file in memory first

const upload = multer({ storage });

// Helper to stream a buffer to Cloudinary
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "door-maestro", ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
