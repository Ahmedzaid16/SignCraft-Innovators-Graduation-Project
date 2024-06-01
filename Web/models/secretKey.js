const crypto = require("crypto");
// Generate a random string of specified length
function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}
// Generate a random secret key
const secretKey = generateRandomString(32);


module.exports = secretKey;