const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";

    // 🔥 video detect
    if (file.mimetype.startsWith("video")) {
      resourceType = "video";
    }

    return {
      folder: "properties",
      resource_type: resourceType,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // ✅ 200MB (video safe)
  },
  fileFilter: (req, file, cb) => {
    // ✅ allow images, pdf, video
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos & PDFs allowed"), false);
    }
  },
});

// ✅ multiple fields upload
const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "documents", maxCount: 5 },
  { name: "video", maxCount: 1 },
  { name: "brochure", maxCount: 1 },
]);

// ✅ single file (optional use)
const uploadSingle = upload.single("document");

module.exports = {
  uploadFields,
  uploadSingle,
};