const User = require("../models/user.js");

module.exports.rendersignup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let{username , Email , password} = req.body ;
    const newUser = new User({Email,username});
    const registerUser = await User.register(newUser , password);
    console.log(registerUser);
    req.login(registerUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "welcome to wanderlust");
        res.redirect("/listings");
    });
    }
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderlogin =  (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success" , "welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings");
    })
}


// add MVC to the Resume