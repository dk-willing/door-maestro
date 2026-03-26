const multer = require("multer");

function createUploadMiddleware({ uploadsDir, maxUploadMb }) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`),
  });

  return multer({
    storage,
    limits: { fileSize: maxUploadMb * 1024 * 1024 },
  });
}

module.exports = { createUploadMiddleware };
