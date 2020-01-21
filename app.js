const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const passport = require("passport");
const app = express();
const User = require("./models/User");

const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");


app.use("/api/users", users);
app.use("/api/tweets", tweets);





// const passport = require('./config/passport');


if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/public"));
  app.get("/", (req, res) => {
    res.sendFile(path.join( "frontend", "public", "index.html"));
  });
}


mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
    const user = new User({
        handle: "jim",
        email: "test2@email.com",
        password:"password123"
    })
    user.save();
    res.send("Hello World");
})






const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
