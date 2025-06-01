const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const router = express.Router();
const upload = multer({ dest: "/images/" });
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
