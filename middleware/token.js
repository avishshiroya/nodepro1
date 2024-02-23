import JWT from "jsonwebtoken"

//create token for the user secret key
export const secretkeyToken = (secretkey) =>{return JWT.sign(secretkey,process.env.JWT_SECRET)}

//verify the token for the user seceret key
export const secretkeyVerify = (secretkey)=>{return JWT.verify(secretkey,process.env.JWT_SECRET)}