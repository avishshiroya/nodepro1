import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true,
    },
    secretkey:{
        type:String,
        // required:true
    },
    googleId:{
        type:String
    },
    displayName:{
        type:String
    }
}, { timestamps: true })
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)

})
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateToken = function(){
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:'7d'
    })
}

const userModel = mongoose.model("Users", userSchema);
export default userModel