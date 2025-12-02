const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
  ],
  authController.registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.loginUser
);

module.exports = router;
