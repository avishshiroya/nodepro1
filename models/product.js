import mongoose from "mongoose";
import { Schema } from "mongoose";
const productSchema = new Schema({
    video:[{
        360:{
            public_id:{type:String},
            url:{type:String}
        },
        720:{
            public_id:{type:String},
            url:{type:String}
        },
        1080:{
            public_id:{type:String},
            url:{type:String}
        }
      }]
}, { timestamps: true })

const productModel = mongoose.model("Products", productSchema);
export default productModel