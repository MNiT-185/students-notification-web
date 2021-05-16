const passport = require('passport')
const bcrypt = require('bcrypt')
const passportLocal = require('passport-local')
const UserModel = require('./../../models/User')
const {transError} = require('./../../../lang/vi')
const LocalStrategy = passportLocal.Strategy

let initPassportLocal = () =>{
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true
    },
    async (req,email,password, done) => {
        try {
            let user = await UserModel.findUserByEmail(email)
            if(!user){
                return done(null, false,req.flash("loginErrors",transError.login_failed));
            }
            if(!user.isActive){
                return done(null, false,req.flash("loginErrors",transError.account_not_active));
            }
            let checkPassword = await user.comparePassword(password)
            if(!checkPassword){
                return done(null, false,req.flash("loginErrors",transError.login_failed));
            }
            return done(null,user)
        } catch (error) {
            return done(null, false,req.flash("loginErrors",transError.failed_database));
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
      
    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
        .then(user => {
            return done(null, user);
        })
        .catch(err =>{
            return done(err,null)
        })
        
    });
}

module.exports = initPassportLocal