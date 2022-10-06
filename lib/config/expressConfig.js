"use strict";

//===============================Load Modules Start========================

const express = require("express"),
    bodyParser = require("body-parser"),//parses information from POST
    methodOverride = require('method-override');//used to manipulate POST

module.exports = function (app, env) {
    // parses application/json bodies
    app.use(bodyParser.json());
    // disable 
    app.disable('x-powered-by');

    // parses application/x-www-form-urlencoded bodies
    // use queryString lib to parse urlencoded bodies
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    app.all('/*', function (req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Pragma,Cache-Control,If-Modified-Since,accessToken, admin, Authorization, platform');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    /**
     * add swagger to our project
     */
    app.use('/apiDocs', express.static(app.locals.rootDir + '/public/dist'));

    //apidoc
    app.use('/apidoc', express.static(app.locals.rootDir + '/public/apidocs'));

    //pages
    app.use('/pages', express.static(app.locals.rootDir + '/public/html'));

    //images
    app.use('/images', express.static(app.locals.rootDir + '/public/images'));
};


