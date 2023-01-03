const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
// to authenticate the 'requests', just add this auth as
// the second parameter in the 'get' reguest

const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // pwd won't be displayed
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error...");
  }
});

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required!").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    // if there is an error while filling out the above fields(name, email and password)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // see if the user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }

      //   password matching/ checking
      const isMatch = await bcrypt.compare(password, user.password); // compares encrypted and plain text

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }

      // Return jsonwebtokens
      const payload = {
        user: {
          id: user.id, //jwt format --> header.payload.signature | payload is readable,it contains body.
        },
      };

      //   signing the jwt token
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
