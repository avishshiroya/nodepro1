import userModel from "../models/user.js";

export const findUser = async ({email}) => { return await userModel.findOne({ email }) }
//save user
export const createUser = async (data) => { return await userModel.create(data) }
//get data using id
export const getUserbyID = async (_id) => { return await userModel.findById(_id) }
