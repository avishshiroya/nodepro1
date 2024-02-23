import joi from "joi"

export const userRegisterValidation = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "Email required",
        "string.empty": "Email cannot be Empty",
        "string.email": "Invalid Email Format"
    }),
    password: joi.string().required().min(8).messages({
        "any.required": "password required",
        "string.empty": "password cannot be empty",
        "string.min": "password have must be 8 character"
    }),
    secretkey: joi.string().required().min(5).messages({
        "any.required": "Email Required",
        "string.empty": "SecretKey can not be empty",
        "string.min": "secretkey have must be 5 character"
    })
})
//login
export const userLoginValidation = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "Email required",
        "string.empty": "Email cannot be Empty",
        "string.email": "Invalid Email Format"
    }),
    password: joi.string().required().min(8).messages({
        "any.required": "password required",
        "string.empty": "password cannot be empty",
        "string.min": "password have must be 8 character"
    })
})
//validation for the upadate user data
export const userUpdateValidation = joi.object({
    email: joi.string().email().required().messages({
        "any.required":"Email Required",
        "string.empty":"Email cannot be empty",
        "string.email":"Invvalid Email Format"
    })
})
//password reset vallidation
export const passwordResetvallidation = joi.object({
    password: joi.string().required().min(8).messages({
        "any.required": "Password Required",
        "string.empty": "password Cannot be empty",
        "string.min": "password have must be 8 character"
    }),
    newpassword: joi.string().required().min(8).messages({
        "any.required": "Password Required",
        "string.empty": "password Cannot be empty",
        "string.min": "password have must be 8 character",
    })
})

