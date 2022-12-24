const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register a user
// @access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(), // body_for_validating('field_name', 'personalized_message').(<rule_name>)
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    // if there is an error while filling out the above fields(name, email and password)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {

      // see if the user exists

      // Get users gravator

      // Encrypt password

      // Return jsonwebtokens

      res.send("User Route");

    } catch (err) {

      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  }
);

module.exports = router;
