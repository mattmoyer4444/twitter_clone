var express = require('express')
    , router = express.Router()
    , connection = require('../../db')
    , Tweet = connection.model('Tweet')
    , ensureAuthentication = require('../../middleware/ensureAuthentication')

router.get('/', ensureAuthentication, function(req, res) {
    var   stream = req.query.stream
        , userId = req.query.userId
        , options = { sort: { created: -1 } }
        , query = null


    if (stream === 'home_timeline') {
        query = { userId: { $in: req.user.followingIds }}
    } else if (stream === 'profile_timeline' && userId) {
        query = { userId: userId }
    } else {
        return res.sendStatus(400)
    }

    Tweet.find(query, null, options, function(err, tweets) {
        if (err) {
            return res.sendStatus(500)
        }
        var responseTweets = tweets.map(function(tweet) { return tweet.toClient() })
        res.send({ tweets: responseTweets })
    })
})

//router.get('*', function (req, res) {
//    //console.log('userId: ' + req.query.userId)
//    //console.log('stream: ' + req.query.stream)
//    if (req.query.stream === 'profile_timeline' && !req.query.userId) {
//        return res.sendStatus(400)
//    }
//    if (!req.query.stream) {
//        return res.sendStatus(400)
//    }
//
//    if (req.query.stream === 'profile_timeline') {
//        // respond with the list of tweets posted by the user
//        // whose id matches the userId query parameter
//        var query = {userId: req.query.userId}
//            , options = {sort: {created: -1}}
//
//        Tweet.find(query, null, options, function (err, tweets) {
//            if (err) {
//                return res.sendStatus(500)
//            }
//            var responseTweets = tweets.map(function (tweet) {
//                return tweet.toClient()
//            })
//            res.send({tweets: responseTweets})
//        })
//    }
//
//    if (req.query.stream === 'home_timeline') {
//        //respond with the list of tweets posted by users
//        // that are followed by the authenticated user
//        console.log(req.body)
//        var query = {}
//            , options = {sort: {created: -1}}
//
//        Tweet.find(query, null, options, function (err, tweets) {
//            if (err) {
//                return res.sendStatus(500)
//            }
//            var responseTweets = tweets.map(function (tweet) {
//                return tweet.toClient()
//            })
//            res.send({tweets: responseTweets})
//        })
//    }
//
//
//})

// get tweet by id
router.get('/:tweetId', function (req, res) {

    //var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
    Tweet.findById(req.params.tweetId, function (err, tweet) {
        if (err) {
            return res.sendStatus(500)
        }
        if (!tweet) {
            return res.sendStatus(404)
        }
        res.send({tweet: tweet.toClient()})
    })
})

router.post('/', ensureAuthentication, function (req, res) {
    var tweetData = req.body.tweet

    tweetData.created = Date.now() / 1000 | 0
    tweetData.userId = req.user.id

    Tweet.create(tweetData, function (err, tweet) {
        if (err) {
            return res.sendStatus(500)
        }
        res.send({tweet: tweet.toClient()})
    })
})


// load middleware at route level
router.delete('/:tweetId', ensureAuthentication, function (req, res) {
    //var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
    var tweetId = req.params.tweetId

    if (!ObjectId.isValid(tweetId)) {
        return res.sendStatus(400)
    }

    Tweet.findById(req.params.tweetId, function (err, tweet) {
        if (err) {
            return res.sendStatus(500)
        }

        if (!tweet) {
            return res.sendStatus(404)
        }

        if (tweet.userId !== req.user.id) {
            return res.sendStatus(403)
        }

        Tweet.findByIdAndRemove(tweet._id, function (err) {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        })


        //_.remove(fixtures.tweets, 'id', req.params.tweetId); // lodash
        //res.send({ tweet: tweet.toClient() })
    })
})


module.exports = router