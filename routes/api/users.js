const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
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
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User already exists!" }] });
      }

      // Get users gravator
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10); // salt is used for hashing purpose

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtokens
      const payload = {
        user: {
          id: user.id, //jwt format --> header.payload.signature | payload is readable,it contains body.
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"), // from default.json
        { expiresIn: 360000 }, // 3600sec = 1hr
        (err, token) => {
          if (err) throw err;
          //else
          res.json({ token });
        }
      ); // the secret token has been created in the default.json, which works as an argument here
    } catch (err) {
      console.error(err.message);
      res.status(200).send("Server Error !");
    }
  }
);

module.exports = router;
