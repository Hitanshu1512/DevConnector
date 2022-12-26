const jwt = require("jsonwebtoken");
const config = require("config");

// next is actually a callback, which is required by middleware functions
// to contact to the Othe fn.(or next functions).
// Or to move to the next piece of middleware .

module.exports = function (req, res, next) {
  // Get the token from then header
  const token = req.header("x-auth-token"); // header key that we want to send along with the token (postman header)

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token! Authorization Denied..." });
  }

  // Otherwise
  // Verify the token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // decoding user in the payload(users.js) and the set that to req.user(original)
    req.user = decoded.user;
    next(); // call the next fn. at last
  } catch (err) {
    res.status(401).json({ msg: "Invalid token!" });
    //   console.log(err.message);
  }
};
