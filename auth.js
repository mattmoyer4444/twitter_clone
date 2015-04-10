var _ = require('lodash')
    , passport = require('passport')
    , fixtures = require('./fixtures')
    , bcrypt = require('bcryptjs')
    , localStrategy = require('passport-local').Strategy;

var conn = require('./db')
    , User = conn.model('User')

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// mentor solution
//passport.deserializeUser(function(id, done) {
//    conn.model('User').findOne({ id: id }, done)
//})

passport.deserializeUser(function (id, done) {
    User.findOne({id: id}, function (err, user) {
        if (user) {
            return done(null, user);
        }
        else {
            done(null, false);
        }
    });
});


function verify(username, password, done) {
    var User = conn.model('User')

    User.findOne({id: username}, function (err, user) {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'})
        }
        bcrypt.compare(password, user.password, function (err, matched) {
            if (err) {
                return done(err)
            }
            matched ? done(null, user)
                : done(null, false, {message: 'Incorrect password.'})
        })
    })
}

passport.use(new localStrategy(verify))

module.exports = passport;