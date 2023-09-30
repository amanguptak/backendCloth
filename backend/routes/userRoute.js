const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  getUserDetails,
  updateUser,
  getAllUsers,
  getUser,
  updateRole,
  deleteUser

} = require("../controller/userController");
const { isAuthenticatedUser ,isAdmin} = require("../middleware/auth");
router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/updatePassword", isAuthenticatedUser, updatePassword);

router.get("/user", isAuthenticatedUser, getUserDetails);
router.put("/user/update", isAuthenticatedUser, updateUser);

router.get("/admin/users",isAuthenticatedUser,isAdmin("admin"),getAllUsers);
router.get("/admin/user/:id",isAuthenticatedUser,isAdmin("admin"),getUser);
router.put("/admin/user/:id",isAuthenticatedUser,isAdmin("admin"),updateRole);
router.delete("/admin/user/:id",isAuthenticatedUser,isAdmin("admin"),deleteUser);

module.exports = router;
