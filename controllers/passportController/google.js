const passport = require('passport')
const UserModel = require('./../../models/User')
const {transError} = require('./../../../lang/vi')
const GoogleStrategy = require('passport-google-oauth2').Strategy

let initPassportGoogle = () =>{
    passport.use(new GoogleStrategy({
        clientID:'194508735007-o5vkp9ive7col2s1taqf9l73td7v5pcj.apps.googleusercontent.com',
        clientSecret:'th81pbFzc9BGL-43r3r4XNAh',
        callbackURL:'http://localhost:3000/google/callback',
        passReqToCallback:true
      },
      async function(req, accessToken, refreshToken, profile, done) {
        filter = /^([0-9])*(@student.tdtu.edu.vn)$/;
        if(filter.test(profile.email)){
            //console.log(profile)
            let user = await UserModel.findByGoogleUid(profile.id)
            //console.log(user)
            if(user){
                return done(null, user);
            }
            let newUserItem = { 
                username : profile.displayName,
                google:{
                    uid: profile.id,
                    token : accessToken,
                    email:  profile.emails[0].value,
                },
            }
            let newUser =await UserModel.createNew(newUserItem)
            return done(null, newUser);
        }
        else{
            return done(null, false,req.flash("loginErrors",transError.account_google_malformed));
        }
      }
    ));
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

module.exports = initPassportGoogle