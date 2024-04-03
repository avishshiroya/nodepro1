import express from "express";
import productModel from "../models/product.js";
import { v2 as cloudinary } from "cloudinary"
import { singleUpload } from "../middleware/multer.js";
import { getDataUri } from "../utils/features.js";
import fs from "fs"
// import { error } from "console";
import { photoUploadController, uploadVideo, uploadVideoFile, uploadimage } from "../controllers/productController.js";
import { sendVideoFileInChunks, uploadVideomanually } from "../photos/fileupload.js";
const router = express();

router.post('/video',uploadVideomanually)
router.get('/video',sendVideoFileInChunks)
router.post('/videoUpload',singleUpload,uploadVideoFile)
router.post('/photo-upload',singleUpload,photoUploadController)

router.post("/post", singleUpload, async (req, res) => {
    try {
        const { name, price } = req.body
        var video;
        // if (req.file) {
            const filepath = 'routes/video.mp4'
            // const file = getDataUri(req.file);
            const chunkSize = 50 * 1024 * 1024;
            const size = fs.statSync(filepath).size;
            console.log(size)
            let start = 0;
            let end =Math.min(chunkSize,size);
            let uploadFile1080,uploadFile720,uploadFile360 = {};
            let partNumber = 1;
            while (start< size) {
                const stream = fs.createReadStream(filepath, { start, end });
                // console.log(stream)
                //  uploadFile1080 = await cloudinary.uploader.upload_stream(file.content,
                //     {
                //         resource_type: "video",
                //         chunk_size: chunkSize,
                //         transformation:
                //             { quality: 108 },

                //     });
                // uploadFile720 = await cloudinary.uploader.upload_stream(file.content,
                //     {
                //         resource_type: "video",
                //         chunk_size: chunkSize,
                //         transformation:
                //             { quality: 72 }
                //     });
                uploadFile360 = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        stream:true,
                        chunk_size:chunkSize
                    },(error,result)=>{
                        if(error){
                            console.log(`eroor =${error}`)
                        }else{
                        console.log(result)}
                    }).end(stream);
                    console.log(uploadFile360,partNumber);
                    start = end;
                    end = Math.min(start+chunkSize,size);
                    partNumber++;
            }
            // if (uploadFile360) {
            //     video = [{
            //         360: {
            //             public_id: uploadFile360.public_id,
            //             url: uploadFile360.secure_url
            //         },
                    // 720: {
                    //     public_id: uploadFile720.public_id,
                    //     url: uploadFile720.secure_url
                    // },
                    // 1080: {
                    //     public_id: uploadFile1080.public_id,
                    //     url: uploadFile1080.secure_url
                    // }
            //     }]
            // } else {
            //     return res.status(401).send({
            //         success: false,
            //         message: "FIle cananot upload"
            //     })
            // }
        // } else {
        //     return res.status(401).send({
        //         success: false,
        //         message: "File didnot get"
        //     })
        // }
        // constproduct = new productModel({
        //     name, price, video
        // })
        await product.save();
        res.status(200).send({
            success: true,
            message: "Product added"
        })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success: false,
            message: "product added error in API"
        })
    }
}
)

router.get("/get", async (req, res) => {
    try {
        const product = await productModel.find({})
        res.status(200).send({
            success: true,
            message: "Product fetched",
            product
        })
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "product fetched error in API"
        })
    }
})

export default router;