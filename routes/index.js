var express = require('express');
var router = express.Router();
var session = require('express-session');
// 5 seconds
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 5000 }}));
var mongoose = require('mongoose'); // for working w/ our database
// currently using my personal database
var database = require('../config/database');
mongoose.connect(database.url);
var Schema = mongoose.Schema;

// define the 'dream' schema
var dreamSchema = new Schema({
    content: String,
    date: { type: Date, default: Date.now},
    points: {type: Number, default: 0}
});
var Dream = mongoose.model('Dream', dreamSchema);

/* GET home page. */
router.get('/', function(req, res) {
    Dream.find(function(err,dreams){
        res.render('index', { "dreamList": dreams });
    });
});

/* POST home page. i.e submit a bucket list thing */
router.post('/create_dream', function(req,res){
    var dream = new Dream();
    dream.content = req.body.dream;
    console.log(dream.content);
    // save the dream
    dream.save(function(err){
        res.redirect('/');
    });
});

/* POST vote, i.e user upvotes  something */
router.post('/upvote/:postId', function(req,res){
    var hasVoted = req.session.hasVoted;
    if (hasVoted==null) {
        Dream.findById(req.params.postId, function (err, dream) {
            if (dream) {
                dream.points++;
                dream.save(function (err) {
                    if (!err) {
                        console.log("Succesfully updated");
                        req.session.hasVoted = true;
                        res.redirect('/');
                    }
                });
            }
        });
    } else {
        res.redirect('/');
    }
});

/* POST vote, i.e user downovtes something */
router.post('/downvote/:postId', function(req,res){
    Dream.findById(req.params.postId, function(err,dream){
        if(dream){
            dream.points--;
            dream.save(function(err){
                if(!err){
                    console.log("Succesfully updated");
                    res.redirect('/');
                }
            });
        }
    });
});

module.exports = router;
