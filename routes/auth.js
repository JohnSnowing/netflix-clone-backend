//crud Operation
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//for encrypting password crypto js

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json("Wrong password or Username!");
      return;
    }

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Wrong password or Username!");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );
    //random secret key for accessToken

    const { password, ...info } = user._doc;
    //to desctructure the return to  not return the password

    res.status(200).json({ ...info, accessToken });
    //pass the refrest token along with the mongo db retur
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
