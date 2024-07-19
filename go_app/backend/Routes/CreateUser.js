const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "Mynameismeetpateliamahandsomeboy%$$%";
const axios = require('axios')
const fetch = require('../middleware/Fetch.middleware.js');

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 4 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      }).then(user => {
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret);
        success = true
        res.json({ success, authToken })
    })
        .catch(err => {
            console.log(err);
            res.json({ error: "Please enter a unique value." })
        })
} catch (error) {
    console.error(error.message)
}
})

// Authentication a User, No login Requiered
router.post('/loginuser', [
  body('email', "Enter a Valid Email").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body;
  try {
      let user = await User.findOne({ email });  //{email:email} === {email}
      if (!user) {
          return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
      if (!pwdCompare) {
          return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
      }
      const data = {
          user: {
              id: user.id
          }
      }
      success = true;
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success, authToken })


  } catch (error) {
      console.error(error.message)
      res.send("Server Error")
  }
});

router.post('/getuser', fetch, async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password") // -password will not pick password from db.
      res.send(user)
  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})
// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
  try {
      let lat = req.body.latlong.lat
      let long = req.body.latlong.long
      console.log(lat, long)
      let location = await axios
          .get("https://maps.googleapis.com/maps/api/geocode/json?address" + lat + "+" + long + "&key={process.env.KEY}")
          .then(async res => {
              // console.log(`statusCode: ${res.status}`)
              console.log(res.data.results)
              // let response = stringify(res)
              // response = await JSON.parse(response)
              let response = res.data.results[0].components;
              console.log(response)
              let { village, county, state_district, state, postcode } = response
              return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
          })
          .catch(error => {
              console.error(error)
          })
      res.send({ location })

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})

module.exports = router;
