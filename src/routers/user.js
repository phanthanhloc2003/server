const express = require("express");
const router = express.Router();
const apiController = require("../controller/UserController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadsMiddleware");
const { authUserMiddleware } = require("../middleware/authUserMiddleware");

router.post("/sign-up", apiController.signUp);
router.post("/sign-in", apiController.signIn);
router.get("/detail-address/:id" , apiController.detailAddress)
router.post("/address",authUserMiddleware, apiController.address);
router.put("/update-address/:id", authUserMiddleware, apiController.updateAddress);
router.delete("/delete-address/:id" ,authUserMiddleware , apiController.deleteAddress )
router.post("/passwork/:id", apiController.passwork);
router.put("/update-user/:id",authMiddleware, apiController.updateUser);
router.delete("/delete-user/:id", authMiddleware, apiController.deleteUser);
router.get("/getAll", authMiddleware, apiController.getAllUsers);
router.get("/get-details/:id",authUserMiddleware, apiController.getDetailsId);
router.post("/refresh-token", apiController.refreshToken);
router.post("/upload-image",upload.single('avatar'), apiController.uploadImage);

module.exports = router;

