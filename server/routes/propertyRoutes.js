const express = require("express");
const router = express.Router();

const property = require("../controllers/propertyController");
const protect = require("../middleware/authmiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("admin"), property.createProperty);

// router.get("/my", protect, authorize("broker"), property.getMyProperties);

router.get("/", property.getAllProperties);
router.get("/:id", property.getPropertyById);

// ✏️ Edit property
router.put(
    "/:id",
    protect,
    authorize("admin"),
    property.updateProperty
  );
  
  // 🗑️ Delete property
  router.delete(
    "/:id",
    protect,
    authorize("admin"),
    property.deleteProperty
  );

module.exports = router;