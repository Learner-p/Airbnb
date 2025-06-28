const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

// Correct GET and POST routes for "/"
router.get("/", wrapAsync(async (req, res) => {
    const { q, country } = req.query;
    let filter = {};

    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ];
    }
    if (country) {
        filter.country = country;
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index", { allListings, q, country });
}));

router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.CreateListing)
);

// New Route
router.get("/new", isLoggedIn, listingController.renderNewform);

// Show, Update, Delete routes
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
