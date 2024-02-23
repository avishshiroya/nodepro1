import express from "express";
import { forgetUserPasswordController, loginUserController, logoutUserController, resetUserPasswordController, updateUserController, userDataController, userRegisterController } from "../controllers/userController.js"
import { isUserAuth } from "../middleware/auth.js";
const router = express();

router.get("/getdata", isUserAuth, userDataController)
router.post("/register", userRegisterController)
router.post("/login", loginUserController)
router.get("/logOut", isUserAuth, logoutUserController)
router.put("/update", isUserAuth, updateUserController)
router.put("/reset-password", isUserAuth, resetUserPasswordController)
router.put("/forget-password", forgetUserPasswordController)


export default router;