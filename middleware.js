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