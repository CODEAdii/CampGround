const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas'); // Assuming schemas.js is in the same directory
const {isLoggedIn}=require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Joi = require('joi');

// Middleware for validating campground data
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}


const isAuthor =async(req,res,next)=>{
  const { id }=req.params;
  const campground= await Campground.findById(id);  
  if(!campground.author.equals(req.user._id)){
    req.flash('error','You do not have persmission to do that!')
    return res.redirect(`/campground/${id}`)
  }
  next();
}

// Display all campgrounds
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

// Show form to create a new campground
router.get('/new', isLoggedIn,(req, res) => {

  res.render('campgrounds/new');
});

// // Handle form submission to create a new campground
// router.post('/', validateCampground, catchAsync(async (req, res, next) => {
//   const { error } = campgroundSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   }

//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   req.flash('success','New Campground Added!!');

//   res.redirect(`/campgrounds/${campground._id}`);
// }));
// Handle form submission to create a new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id; 
  await campground.save();
  req.flash('success', 'New Campground Added!!');
  res.redirect(`/campgrounds/${campground._id}`);
}));



// Show details of a specific campground
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
  console.log(campground);
  if(!campground){
    req.flash('error','Campground doesnot exists!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground});
}));

// Show form to edit a campground
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req, res) => {
  const {id}=req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error','Cannot find that campground!');
    return res.redirect('/campgrounds');
  } 
  res.render('campgrounds/edit', {campground});
}));

// Handle form submission to edit a campground
router.put('/:id',isLoggedIn,isAuthor,validateCampground, catchAsync(async (req, res) => {
  
  const { id } = req.params;
 
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success','Successfully Updated!');

  res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete a campground
router.delete('/:id',isLoggedIn, isAuthor,catchAsync(async (req, res) => {
  const { id } = req.params;
 const deletedCampground= await Campground.findByIdAndDelete(id);

 if (!deletedCampground){
  req.flash('error', 'Campground not found or already deleted');
  return res.redirect('/campgrounds');

}
 req.flash('success', `${deletedCampground.title} Campground deleted!!`);
 res.redirect('/campgrounds');
}));

module.exports = router;
