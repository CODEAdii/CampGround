const express = require('express');
const router = express.Router({mergeParams:true});
const reviews = require('../controllers/reviews');
//since the id is not define in the review path we use mergeParams:true in oder to use params id
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


//create review
router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview))


//delete reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))
  



module.exports=router;
