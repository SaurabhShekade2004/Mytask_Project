const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/profile", auth, userController.getProfile);

router.put(
  "/update",
  auth,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("designation")
      .optional()
      .notEmpty()
      .withMessage("Designation cannot be empty"),
  ],
  userController.updateProfile
);

router.put(
  "/change-password",
  auth,
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "New password must be 8 chars long & contain uppercase, lowercase, number & special character"
      ),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required"),
  ],
  userController.changePassword
);

module.exports = router;
