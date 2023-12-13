const express=require('express');
const router=express.Router({mergeParams:true});
//since the id is not define in the review path we use mergeParams:true in oder to use params id

const Campground=require('../models/campground');
const Review=require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const{reviewSchema}=require('../schemas.js')



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }
router.post('/', validateReview,catchAsync(async(req, res)=>{
    // res.send("You made it");
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.campground = campground; // Make sure the association is set
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success','Review Added!!');

  res.redirect(`/campgrounds/${campground._id}`);
  
  }))
  //delete reviews
router.delete('/:reviewId',catchAsync(async(req,res)=>{
  const {id,reviewId}= req.params;
  await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId} });
  await Review.findByIdAndDelete(reviewId);

  req.flash('success','Review Deleted!!');
  res.redirect(`/campgrounds/${id}`);
}))
  



module.exports=router;