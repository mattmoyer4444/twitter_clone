var _ = require('lodash')
    , config = require('./config')
    , bodyParser = require('body-parser')
    , express = require('express')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , passport = require('./auth')
    , fixtures = require('./fixtures')
    , shortId = require('shortid')
    , app = express();

//var connection = require('./db');
//var User = connection.model('User');
//var Tweet = connection.model('Tweet');

// we know that the message body is in JSON format
// so we load the json() middleware component from body-parser only
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/tweets', function (req, res) {

    if (!req.query.userId) {
        return res.sendStatus(400)
    }

    var tweets = _.where(fixtures.tweets, {userId: req.query.userId})
    var sortedTweets = tweets.sort(function (a, b) {
        return b.created - a.created
    });

    res.send({tweets: sortedTweets})


});

app.post('/api/tweets', ensureAuthentication, function(req, res) {
    var tweet = req.body.tweet;
    tweet.userId = req.user.id;

    tweet.id = shortId.generate();
    tweet.created = Date.now() / 1000 | 0;

    fixtures.tweets.push(tweet);

    //console.log(fixtures.tweets);
    res.send({ tweet: tweet })
});

app.post('/api/tweets', ensureAuthentication, function(req, res) {
    var tweet = req.body.tweet

    tweet.id = shortId.generate()
    tweet.created = Date.now() / 1000 | 0

    // overwrite the userId field with the authenticated user id
    tweet.userId = req.user.id

    fixtures.tweets.push(tweet)

    res.send({ tweet: tweet })
});


// get tweet by id
app.get('/api/tweets/:tweetId', function (req, res) {
    var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
    //console.log(fixtures.tweets)
    if(tweet) {
        res.send({tweet: tweet});

    }
    else {
        return res.sendStatus(404)
    }


});

// load middleware at route level
app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
    var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);

    if (!tweet) {
        return res.sendStatus(404)
    }

    if (tweet.userId !== req.user.id) {
        return res.sendStatus(403)
    }

    _.remove(fixtures.tweets, 'id', req.params.tweetId);

    res.sendStatus(200)
});

app.post('/api/users', function(req, res) {
    var user = req.body.user;

    if (_.find(fixtures.users, 'id', user.id)) {
        return res.sendStatus(409)
    }

    user.followingIds = [];
    fixtures.users.push(user);

    req.login(user, function(err) {
        if (err) {
            return res.sendStatus(500)
        }
        res.sendStatus(200)
    })
});



// get user by id
app.get('/api/users/:userId', function (req, res) {
    var user = _.find(fixtures.users, 'id', req.params.userId);

    if (!user) {
        return res.sendStatus(404)
    }

    res.send({user: user})
});

app.post('/api/auth/login', function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.sendStatus(500)
        }
        if (!user) {
            return res.sendStatus(403)
        }
        req.login(user, function(err) {
            if (err) {
                return res.sendStatus(500)
            }
            return res.send({ user: user })
        })
    })(req, res)
});

app.post('/api/auth/logout', function(req, res) {
    req.logout()
    res.sendStatus(200)
});

// middleware implementation
function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendStatus(403)
}

var server = app.listen(config.get('server:port'), config.get('server:host'))

//console.log(config.get('database:name'))
// prints "twittertest" if NODE_ENV=test


module.exports = server