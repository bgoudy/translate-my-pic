var express = require('express');
var router = express.Router();

// Require controller modules
var translateController = require('../controllers/translate-my-pic-controller');

// Routes
// This route will perform a POST request to create a new user
router.post("/users", translateController.createUser);

// This route will perform a GET request to authenticate the user so he can log in
router.get("/auth", translateController.authUser);

// This route performs a GET request to retrieve all translations
router.get("/translations", translateController.getTranslations);

// This route performs a POST request to create a new translation record
router.post("/translations", translateController.createTranslation);

// Exports the translate-my-pic-plus API routes
module.exports = router;