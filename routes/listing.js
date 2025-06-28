const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const  listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(async (req, res) => {
        const { q } = req.query;
        let allListings;
        if (q) {
            // Simple case-insensitive search on title, location, or country
            allListings = await Listing.find({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { location: { $regex: q, $options: "i" } },
                    { country: { $regex: q, $options: "i" } }
                ]
            });
        } else {
            allListings = await Listing.find({});
        }
        res.render("listings/index", { allListings, q });
    }))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.CreateListing)
    );


//New Route
router.get("/new",isLoggedIn , listingController.renderNewform);


router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))   //Show route
    .put( isLoggedIn , isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))   //update route
    .delete( isLoggedIn ,isOwner, wrapAsync(listingController.destroyListing));  //Delete route


//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));



module.exports = router ;
