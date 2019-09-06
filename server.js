// Required dependencies and packages
var express = require("express");

// Sets up the Express.js application
var app = express();
var PORT = process.env.PORT || '8080';

// Requiring our models for synchronization
var db = require("./models");

// Sets up the Express.js application to allow for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory for application assets
app.use(express.static(process.cwd() + "/public"));

// Require routes HTML pages and APIs
var routes = require("./controllers/translate-my-pic-controller");

app.use("/", routes);

// Synchonizes the Sequelize models and then starts up the application
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on Port: " + PORT);
  });
});
