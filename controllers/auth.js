var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var myReddit = require('../lib/reddit.js');
app.set('view engine', 'pug');


module.exports = function(myReddit) {
    var authController = express.Router();

    authController.get('/login', function(request, response) {
        response.render("login-form");
    });

    authController.post('/login', urlencodedParser, function(request, response) {
        var input = request.body;

            return myReddit.checkUserLogin(input.username, input.password)

        .then(resp =>{

            return myReddit.createUserSession(resp[0].id);

        })
        .then(resp =>{


            response.cookie('SESSION', resp.id).redirect('/');

        });



    });

    authController.get('/signup', function(request, response) {
        response.render('signup-form');
    });

    authController.post('/signup', urlencodedParser, function(request, response) {
       var input = request.body;
       myReddit.createUser({
           username: input.username,
           password: input.password
           })

        .then(

            response.redirect('/auth/login')
            )
        .catch(error => {
            console.log(error + " " + "here is the error");
        });



    });
    
    return authController;
};
