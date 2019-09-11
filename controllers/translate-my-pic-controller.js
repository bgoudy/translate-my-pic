// Required dependencies and packages
var db = require("../models");

// Routes
// Creates a new user record in the Users database
exports.createUser = function (req, res)
{
    db.User.create(
    {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    }).then(function(dbTranslate)
    {
        res.json(dbTranslate);
    })
};

// Authenticates a user during the log in process by comparing the username and password provided in the request
exports.authUser = function (req, res)
{
    db.User.findOne(
    {
        where:
        {
            email: req.body.email,
            password: req.body.password
        }
    }).then(function(dbTranslate)
    {
        if(dbTranslate == null)
        {
            res.json(
            {
                "Outcome Code": 401,
                "Message": "Incorrect email or password."
            });
        }
        else
        {
            res.json(
            {
                "Outcome Code": 200,
                "Outcome Message": "Authentication successful.",
                "Token": dbTranslate.id
            });
        }
    });
};

// Retrieves all translations not deleted for a user in the Translations table of the database
exports.getTranslations = function(req, res)
{
    db.Translation.findAll(
    {
        where: 
        {
            user_id: req.body.user_id,
            deleted: false
        }
    }).then(function(dbTranslate)
    {
        res.json(dbTranslate); // Returns a JSON array of all translations
    });
};

// Creates a new translation record in the Translations table of the database
exports.createTranslation = function(req, res)
{
    db.Translation.create(
    {
        user_id: req.body.user_id,
        translated_language: req.body.translated_language,
        analyzed_keywords: req.body.analyzed_keywords,
        translated_keywords: req.body.translated_keywords,
    }).then(function(dbTranslate)
    {
        res.json(
        {
            "Outcome Code": 200,
            "Outcome Message": "Translation has been saved."
        });
    });
};

// Marks a translation as deleted in the Translations table of the database
exports.deleteTranslation = function(req, res)
{
    db.Translation.update(
    {
        deleted: true,
    },
    {
        where: 
        {
            id: req.body.translation_id,
            user_id: req.body.user_id
        }
    }).then(function(dbTranslate)
    {
        res.json(
        {
            "Outcome Code": 200,
            "Outcome Message": "Translation has been deleted.",
            "Translation ID": req.body.translation_id,
            "User ID": req.body.user_id
        }
        ); // Returns a JSON array of all translations
    });
};