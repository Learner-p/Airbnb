const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")

//Reviews
//Post Route
router.post("/", isLoggedIn, validateReview ,wrapAsync(reviewController.CreateReview));

//Delete Reviews Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.DeleteReview));


module.exports = router ;