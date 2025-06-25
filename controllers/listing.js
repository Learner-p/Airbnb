const Listing = require("../models/listing")


//Index route
module.exports.index = async(req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
}

//New route
module.exports.renderNewform =(req , res)=>{
    res.render("listings/new");
}

//Create route
module.exports.CreateListing = async (req, res) => {
    const listing = new Listing(req.body.listing);
    if (req.file) {
        listing.image.url = req.file.path;      // Cloudinary URL
        listing.image.filename = req.file.filename; // Cloudinary public_id
    }
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${listing._id}`);
};

//Show route
module.exports.showListing = async(req , res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate:{
            path:"author"
        }})
        .populate("owner");
    if(!listing){
        req.flash("error", " Listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", {listing});
}

//Edit route
module.exports.renderEditForm = async(req , res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", " Listing you requested does not exist");
        return res.redirect("/listings");
    }
    let OriginalImgUrl = listing.image.url ;
    OriginalImgUrl = OriginalImgUrl.replace("/upload","/upload/,w_250")
    res.render("listings/edit", {listing , OriginalImgUrl});
}

//Update route
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    // If a new image was uploaded, update the image fields
    if (typeof req.file !== "undefined") {
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
};

//Delete route
module.exports.destroyListing =  async(req,res)=>{
    let {id} = req.params ;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing  Deleted");
    res.redirect("/listings");
}
