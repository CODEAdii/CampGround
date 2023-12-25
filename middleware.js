 // Assuming schemas.js is in the same directory
 const { campgroundSchema,reviewSchema } = require('./schemas');
const ExpressError=require('./utils/ExpressError');
// Add this line to import the Campground model
const Campground = require('./models/campground'); 
const Review = require('./models/review');


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}



module.exports.isLoggedIn=(req,res,next)=>{
 //we use passport helper method i.e is Authencated----to show login user access
  if(!req.isAuthenticated()){
 req.session.returnTo=req.originalUrl
    req.flash('error','You must be register to Yelp Camp');
    return res.redirect('/login');
  }
  next();
}



// Middleware for validating campground data
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}




module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // Check if user is logged in
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to be logged in to do that!');
    return res.redirect('/login'); // Redirect to the login page if not logged in
  }

  // Check if the user is the author of the campground
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review || !review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};



module.exports.validateReview = (req,res,next) => {
  const{error} = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
}
