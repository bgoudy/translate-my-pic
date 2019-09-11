// Required dependencies and packages
var db = require("../models");

// Routes
// This route will perform a POST request to create a new user
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

// This route will perform a GET request to authenticate the user so he can log in
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

// This route performs a GET request to retrieve all translations
exports.getTranslations = function(req, res)
{
    db.Translation.findAll({}).then(function(dbTranslate)
    {
        res.json(dbTranslate); // Returns a JSON array of all translations
    });
};

// This route performs a POST request to create a new translation record
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