const Campground = require('../models/campground');

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }

module.exports.renderNewForm=(req, res) => {

    res.render('campgrounds/new');
  }

module.exports.createCampground=async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id; 
    await campground.save();
    req.flash('success', 'New Campground Added!!');
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
   console.log(campground);
    if(!campground) {
      req.flash('error','Campground doesnot exists!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground});
  }  

 module.exports.renderEditCampground=async(req, res) => {
    const {id}=req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error','Cannot find that campground!');
      return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/edit', {campground});
  } 
  module.exports.updateCampground= async (req, res) => {
  
    const { id } = req.params;
   
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Successfully Updated!');
  
    res.redirect(`/campgrounds/${campground._id}`);
  }
  module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
   const deletedCampground= await Campground.findByIdAndDelete(id);
  
   if (!deletedCampground){
    req.flash('error', 'Campground not found or already deleted');
    return res.redirect('/campgrounds');
  
  }
   req.flash('success', `${deletedCampground.title} Campground deleted!!`);
   res.redirect('/campgrounds');
  }

