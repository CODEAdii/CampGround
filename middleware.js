const express = require('express');
const router = express.Router();
const campgrounds=require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground,validateReview}=require('../middleware');
const Campground = require('../models/campground');

// // Display all campgrounds
// router.get('/', catchAsync(campgrounds.index));
// // Show form to create a new campground
// router.get('/new', isLoggedIn,campgrounds.renderNewForm);
// // // Handle form submission to create a new campground
// // router.post('/', validateCampground, catchAsync(async (req, res, next) => {
// //   const { error } = campgroundSchema.validate(req.body);
// //   if (error) {
// //     const msg = error.details.map(el => el.message).join(',');
// //     throw new ExpressError(msg, 400);
// //   }
// //   const campground = new Campground(req.body.campground);
// //   await campground.save();
// //   req.flash('success','New Campground Added!!');
// //   res.redirect(`/campgrounds/${campground._id}`);
// // }));
// // Handle form submission to create a new campground
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// // Show details of a specific campground
// router.get('/:id', catchAsync(campgrounds.showCampground));
// // Show form to edit a campground
// router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditCampground ))
// // Handle form submission to edit a campground
// router.put('/:id',isLoggedIn,isAuthor,validateCampground, catchAsync(campgrounds.updateCampground));
// // Delete a campground
// router.delete('/:id',isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));



//-----------------fancy way to restructure our routesss-----

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post( isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn,campgrounds.renderNewForm);


 router.route('/:id')  
    .get( catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground))

   
 router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditCampground ))


 
module.exports = router;
 
