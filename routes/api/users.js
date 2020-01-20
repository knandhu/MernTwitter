// const jwt = require("jsonwebtoken");
const express = require("express");
const keys = require("../../config/keys");

const router = express.Router();

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const bcrypt = require("bcryptjs");

const User = require('./../../models/User');
const passport = require("passport");
const jwt = require("jsonwebtoken");

// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({
//       id: req.user.id,
//       handle: req.user.handle,
//       email: req.user.email
//     });
//   }
// );

router.post("/register", (req, res) => {
   
//   const { errors, isValid } = validateRegisterInput(req.body);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

 User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Throw a 400 error if the email address already exists
        return res.status(400).json({email: "A user has already registered with this address"})
      } else {
        // Otherwise create a new user
          const newUser = new User({
              handle: req.body.handle,
              email: req.body.email,
              password: req.body.password
          });

        //   newUser.save().then(user => res.send(user)).catch(err => res.send(err));

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then((user) => res.json(user))
                    .catch(err => console.log(err))
            })
            // newUser
            //   .save()
            //   .then(user => {
            //     const payload = { id: user.id, handle: user.handle };

            //     jwt.sign(
            //       payload,
            //       keys.secretOrKey,
            //       { expiresIn: 3600 },
            //       (err, token) => {
            //         res.json({
            //           success: true,
            //           token: "Bearer " + token
            //         });
            //       }
            //     );
            //   })
            //   .catch(err => console.log(err));
        //   })
        })
      }
    })
})

router.post("/login", (req, res) => {
//   const { errors, isValid } = validateLoginInput(req.body);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }

  const email = req.body.email;
  const password = req.body.password;

    User.findOne({ email }).then(user => {
    if (!user) {
      // Use the validations to send the error
    //   errors.email = "User not found";
      return res.status(404).json({email: "this user doesn't exist"});
    }

//       const handle = req.body.handle;
//   const password = req.body.password;

//   User.findOne({ handle }).then(user => {
//     if (!user) {
//       errors.handle = "This user does not exist";
//       return res.status(400).json(errors);
//     }
  bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({msg: "success!"})
      const payload = { id: user.id, handle: user.handle, email:user.email };

      jwt.sign(
        payload,
        keys.secretOrKey,
        // Tell the key to expire in one hour
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        }
      );
    } else {
        //   errors.password = "Incorrect password";
      return res.status(400).json({ password: "Incorrect password" });
    }
  });
  });
});

router.get("/test", (req, res) => {
    res.json({ msg: "This is the user route" });
});



module.exports = router;