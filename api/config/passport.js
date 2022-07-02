const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

modulo.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null, user._id);
    })

    passport.deserializeUser(function(id, done){
        User.findById(id, function (err, user){
            done(err, user);
        })
    })

    passport.use(new LocalStrategy)(
        function (username, password, done){
            User.findOne({username: username}, function (err, user){
                if(err){
                    return done(err);
                }
                if (!user){
                    return done(null, false, {message: 'Inválid Username'});
                }
                if (!user.validPassword(password)){
                    return done(null, false, {message: 'Inválid Password'});
                }
                return done(null, user);
            })
        }
    )
};