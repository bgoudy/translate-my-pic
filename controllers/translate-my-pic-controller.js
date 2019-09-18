// Required dependencies and packages
var db = require("../models");
var bcrypt = require("bcrypt");

// Creates a new user record in the Users database
exports.createUser = function (req, res)
{
    bcrypt.hash(req.body.password, 10, function(err, hash)
    {
        db.User.create(
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash
        }).then(function(dbTranslate)
        {
            if(dbTranslate.id =! null)
            {
                res.json(
                {
                    "Code": 200,
                    "Message": "Account creation successful.",
                    "Token": dbTranslate.id,
                    "Hash": hash
                });
            }
            else
            {
                res.json(
                {
                    "Code": 401,
                    "Message": "Error creating new user."
                });
            }
        });
    });
};

// Authenticates a user during the log in process by comparing the username and password provided in the request
exports.authUser = function (req, res)
{
    db.User.findOne(
    {
        where:
        {
            email: req.query.email,
        }
    }).then(function(dbTranslate)
    {
        hash = dbTranslate.password;
        
        if(dbTranslate != null)
        {
            bcrypt.compare(req.query.password, hash, function(error, response)
            {
                if(response)
                {
                    res.json(
                    {
                        "Code": 200,
                        "Message": "Authentication successful.",
                        "Token": dbTranslate.id
                    });
                }
                else
                {
                    db.res.json(
                    {
                        "Code": 401,
                        "Message": "Incorrect email address or password."
                    });
                } 
            });
        }
        else
        {
            res.json(
            {
                "Code": 401,
                "Message": "Incorrect email address or password."
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
            user_id: req.query.user_id,
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
            "Code": 200,
            "Message": "Translation has been saved."
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
            "Code": 200,
            "Message": "Translation has been deleted.",
            "Translation ID": req.body.translation_id,
            "User ID": req.body.user_id
        }
        ); // Returns a JSON array of all translations
    });
};