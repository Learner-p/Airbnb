const express = require("express");
const router = express.Router();
const multer = require("multer");

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// Utility to build dynamic filter object
const buildListingFilter = (q, country) => {
  const conditions = [];

  if (q) {
    conditions.push({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } }
      ]
    });
  }

  if (country) {
    conditions.push({ country });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
};

// Index Route — Filtered Listings
router.get("/", wrapAsync(async (req, res) => {
  const { q, country } = req.query;
  const filter = buildListingFilter(q, country);

  const allListings = await Listing.find(filter);
  res.render("listings/index", { allListings, q, country });
}));

// Create Route — New Listing
router.post("/",
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.CreateListing)
);

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewform);

// Show, Update, Delete Listing
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Form Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
