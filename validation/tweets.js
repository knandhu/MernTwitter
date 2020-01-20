// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const passport = require("passport");

// const Tweet = require("./../models/Tweet");
const Validator = require("validator");
const validText = require("./../validation/valid-text");

module.exports = function validateTweetInput(data) {
  let errors = {};

  data.text = validText(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 5, max: 140 })) {
    errors.text = "tweets must be between 5 and 140 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
