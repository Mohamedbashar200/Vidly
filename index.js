/** @format */
require("express-async-errors");
require("winston-mongodb");

const winston = require("winston");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtException.log" })
);

process.on("unHandledRejection", (ex) => {
  throw ex;
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.mongoDB, { db: "mongodb://localhost/vidly" });

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR:jwtPrivateKey is not defined");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
