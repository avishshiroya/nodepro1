import userModel from "../models/user.js"
import JWT from "jsonwebtoken"

export const isUserAuth = async (req,res,next)=>{
    try {
        const {authentication} = req.cookies
        if(!authentication){
            return res.status(401).send({
                success:false,
                message:"Login Please",
            })
        }
        const userid = JWT.verify(authentication,process.env.JWT_SECRET)
        const user = await userModel.findById({_id:userid._id},{password:0,secretkey:0})
        console.log(user)
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({
            success:false,
            message:"Error In user authentication middleware"
        })
    }
}