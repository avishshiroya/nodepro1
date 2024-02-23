// import { errorHandler } from "../middleware/errorHandler.js";
import errorHandler from "../middleware/errorHandler.js";
import { secretkeyToken, secretkeyVerify } from "../middleware/token.js";
import userModel from "../models/user.js"
import { createUser, findUser, getUserbyID } from "../service/userService.js";
import { passwordResetvallidation, userLoginValidation, userRegisterValidation, userUpdateValidation } from "../validation/userValidation.js";
export const userRegisterController = async (req, res,next) => {
    try {
        const { email, password, secretkey } = req.body
        const checkUser = await userRegisterValidation.validate(req.body, {
            abortEarly: false
        });
        if (checkUser.error) {
            return errorHandler(checkUser.error,req,res)
        }
        const checkEmail = await findUser({ email })
        // console.log(checkEmail)
        if (checkEmail) {
            return res.status(401).send({
                success: false,
                message: "Email must be unique"
            })
        }
        const secretkeyJWT = secretkeyToken(secretkey)
        // console.log(password, email)
        if (!secretkeyJWT) {
            return res.status(401).send({
                success: false,
                message: "Token Not Created"
            })
        }
        const userData = {
            email, password, secretkey: secretkeyJWT
        }
        const userCreate = await createUser(userData);
        res.status(200).send({
            success: true,
            message: "user Register",
            userCreate
        })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success: false,
            message: "Error in User Register API"
        })
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body
        const checkUser = userLoginValidation.validate(req.body, {
            abortEarly: false
        })
        if (checkUser.error) {
            return res.status(401).send({
                success:false,
                message:checkUser.error.message
            })
        }
        const user = await findUser({ email })
        // console.log(user)
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Please register Your email"
            })
        }
        const comparePassword = await user.comparePassword(password);
        // console.log(comparePassword)
        if (!comparePassword) {
            return res.status(401).send({
                success: false,
                message: "password Uncorrect"
            })
        }
        const token = user.generateToken();

        res.status(200).cookie("authentication", token, {
            expireIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            httpOnly: process.env.NODE_ENV==="development"?true:false,
            secure:  process.env.NODE_ENV==="development"?true:false,
            sameSite: process.env.NODE_ENV==="development"?true:false

        }).send({
            success: true,
            message: "Login Successfully",
            // token, user
        })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success: false,
            message: "Error in Login API"
        })
    }
}

export const userDataController = async (req, res) => {
    try {
        const { _id } = req.user
        if (!_id) {
            return res.status(401).send({
                success: false,
                message: "Login Again"
            })
        }
        res.status(200).send({
            success: true,
            message: "user data",
            user: req.user
        })
    } catch (error) {
        return res.status(401).send({
            success: true,
            message: "Error In user Data Get API"
        })
    }
}
export const logoutUserController = async (req, res) => {
    try {
        res.status(200).cookie("authentication", "", {
            expiresIn: new Date(Date.now())
        }).send({
            success: true,
            messgae: "LogOut"
        })
    } catch (error) {
        return res.status(401).send({
            success: true,
            message: "Error In LogOut API",
            error
        })
    }
}
export const updateUserController = async (req, res) => {
    try {
        const checkUser = userUpdateValidation.validate(req.body, {
            abortEarly: false
        })
        if (checkUser.error) {
            return res.status(401).send({
                success: false,
                message: "Correct Yout Input Details"
            })
        }
        const user = await getUserbyID(req.user._id)
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User Not Available"
            })
        }
        console.log(user)
        const { email } = req.body
        const checkEmail = await userModel.findOne({ email })
        if (checkEmail) {
            return res.status(401).send({
                success: false,
                message: "Provide Unique Email"
            })
        }
        if (email) user.email = email;
        await user.save();
        res.status(200).send({
            success: true,
            message: "User Updated",
            user
        })
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Error In User Update API"
        })
    }
}

//reset password
export const resetUserPasswordController = async (req, res) => {
    try {
        const checkInput = passwordResetvallidation.validate(req.body, {
            abortEarly: false
        })
        if (checkInput.error) {
            return res.status(401).send({
                success: false,
                message: checkInput.error.message
            })
        }
        const { password, newpassword } = req.body
        if (password == newpassword) {
            return res.status(401).send({
                success: false,
                message: "Both password cannot be same"
            })
        }
        const user = await getUserbyID(req.user._id);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User unauthorized"
            })
        }
        const checkOldPassword = await user.comparePassword(password)
        if (!checkOldPassword) {
            return res.status(401).send({
                success: false,
                message: "Correct your Old Password"
            })
        }
        user.password = newpassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success: false,
            message: "Error in reset password API",
            error
        })
    }
}

export const forgetUserPasswordController = async (req, res) => {
    try {
        const { email, secretkey, password } = req.body
        const checkInput = userRegisterValidation.validate(req.body);
        if (checkInput.error) {
            return res.status(401).send({
                success: false,
                message: checkInput.error.message
            })
        }
        const user = await findUser({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User unauthorized"
            })
        }
        //    const verifySecretkey =  JWT.verify(user.secretkey,process.env.JWT_SECRET);
        const verifySecretkey = secretkeyVerify(user.secretkey)
            // console.log(verifySecretkey);
        if (secretkey !== verifySecretkey) {
            return res.status(401).send({
                success: false,
                message: "SecretKey cannot match"
            })
        }
        user.password = password
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Update",
            // user
        })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success: false,
            message: "Error In Forgot Password API",
            error
        })
    }
}