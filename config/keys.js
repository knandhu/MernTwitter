// module.exports = {
//   mongoURI:
//     "mongodb+srv://mcUser:zM6EKnmyJM9iO3QQ@cluster0-bmq8p.mongodb.net/test?retryWrites=true&w=majority",
//     secretOrKey: "secret"
// };

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keys_prod");
} else {
  module.exports = require("./keys_dev");
}

