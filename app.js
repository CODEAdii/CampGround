const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash=require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const passport =require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/user');

const userRoutes=require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');



mongoose.connect('mongodb://127.0.0.1:27017/yelp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
  .then(()=>{
    console.log("Mongo__Connection Open")
  })
  .catch(err=>{
    console.log("Oh No ~Mongo__Connection Error!")
    console.log(err)
  })
  const app = express();


app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname ,'views'));
app.set('view engine','ejs');

//tell express to parse the body
app.use(express.urlencoded({extended:true}));


app.use(methodOverride('_method'));

// app.use(express.static('public'))---modified belowwww--

app.use(express.static(path.join(__dirname,'public')))
// mongoose.connect('mongodb://localhost:27017/yelp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });


// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));






// const validateReview = (req, res, next) => {
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//       const msg = error.details.map(el => el.message).join(',')
//       throw new ExpressError(msg, 400)
//   } else {
//       next();
//   }
// }
/************************************************************************************************/
//we make separate  rotes folder for campground--------------
// app.get('/', (req, res) => {
//   res.render('home');
// });
// // app.get('/makecampground',async(req,res) =>{
// //    const camp=new Campground({title:"My Backyard",description:"Affordable and friendly LandLord"});
// //    await camp.save();
// //    res.send(camp)
// // })


// app.get('/campgrounds', catchAsync(async(req, res) => {
//    const campgrounds=await Campground.find({});
//    res.render('campgrounds/index',{campgrounds} )
// }));

// app.get('/campgrounds/new',(req,res)=>{
//   res.render('campgrounds/new');
// })

// //form submited

// app.post('/campgrounds' ,catchAsync(async(req,res,next)=>{
//   // try{   --joi schema valiodation---
//   const campgroundSchema=Joi.object({
//     campground:Joi.object({
//       title:Joi.string().required(),
//       price:Joi.number().required().min(0),
//     }).required()
//   });
//   const {error} = campgroundSchema.validate(req.body);
//   if(error){
//     const msg=error.details.map(el=> el.message).join(',')
//     throw new ExpressError(result.error.details,400)
//   }
//   console.log(result);

//   const campground = new Campground(req.body.campground);
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`)
//   // })catch(e){
//   //   next(e);
//   // }
//  }
// ))


// app.get(`/campgrounds/:id`, catchAsync(async (req,res,)=>{
//   const campground = await Campground.findById(req.params.id).populate('reviews');
//   res.render('campgrounds/show',{campground});
// }));

// //edittt
// app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
//   const campground = await Campground.findById(req.params.id)
//   res.render('campgrounds/edit',{campground});
// }));



// app.put('/campgrounds/:id',catchAsync(async(req,res)=>{
//  const {id}=req.params;
//   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
//   res.redirect(`/campgrounds/${campground._id}`);
// }));
// //delete
// app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
//   const {id}=req.params;
//   await Campground.findByIdAndDelete(id);
//   res.redirect('/campgrounds');
// }));

/************************************************************************************************/
const sessionConfig ={
  secret:'thisissecrete',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now() +1000*60*60*24*7,//if not set user will login forevr
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
 console.log(req.session)
 res.locals.currentUser=req.user;
 res.locals.success=req.flash('success');
 res.locals.error=req.flash('error');
 next();

})


app.get('/fakeUSer',async(req,res)=>{
  const user= new User({email:'asgdkja@gmail.com',username:'panda'})
  const newUser = await User.register(user,'123');
  res.send(newUser);
})

app.use('/',userRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.use('/campgrounds',campgroundRoutes)



app.get('/', (req, res) => {
  res.render('home');
});




// app.post('/campgrounds/:id/reviews', validateReview,catchAsync(async(req, res)=>{
//   // res.send("You made it");
// const campground = await Campground.findById(req.params.id);
// const review = new Review(req.body.review);
// review.campground = campground; // Make sure the association is set
// campground.reviews.push(review);
// await review.save();
// await campground.save();
// res.redirect(`/campgrounds/${campground._id}`);

// }))
// //delete reviews
// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{
//   const {id,reviewId}= req.params;
//   await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId} });
//   await Review.findByIdAndDelete(reviewId);
// res.redirect(`/campgrounds/${id}`);
// }))


//apply 404 
app.all('*',(req,res,next)=>{
  // res.send("404!!")
  //we will use our ExpressError class --
  next(new ExpressError('Page Not Found',404));

});

app.use((err,req,res,next)=>{
  // res.send('Oh boy,something went wrong')
 const {statusCode = 500}=err;
 if(!err.message)err.message='Oh No, Something Went Wrong!'
 res.status(statusCode).render('error',{err});

})


app.listen(3000, () => {
  console.log('Serving on port 3000!');
})
