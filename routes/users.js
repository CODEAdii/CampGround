const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const user=require('../controllers/users');

const User=require('../models/user');
const { storeReturnTo } = require('../middleware');

const passport = require('passport');


// router.get('/register',user.renderRegister);

// router.post('/register', catchAsync(user.register));
router.route('/register')
   .get(user.renderRegister)
   .post(catchAsync(user.register))


// router.get('/login',user.renderLogin)

// // router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),async(req,res)=>{
// //    req.flash('success','Welcome back');
// //    const redirectUrl=req.session.returnTo ||'/campgrounds';
// //    res.redirect(redirectUrl);
   
// // })

// router.post('/login',
//     // use the storeReturnTo middleware to save the returnTo value from session to res.locals
//     storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
//     // Now we can use res.locals.returnTo to redirect the user after login
//     user.login);

router.route('/login')
  .get(user.renderLogin)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    user.login)



router.get('/logout', user.logout); 
  






module.exports=router;
