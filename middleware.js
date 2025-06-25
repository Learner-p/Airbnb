const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be Logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if (error){
        let errMsg =  error.details.map((el)=> el.message).join(",") ;
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    // Convert rating to number if it's a string
    if (req.body.review && typeof req.body.review.rating === "string") {
        req.body.review.rating = Number(req.body.review.rating);
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // handle error
        return res.status(400).send(error.details.map(el => el.message).join(","));
    }
    next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You did not created this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
