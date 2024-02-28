import { v2 as cloudinary } from "cloudinary"
import fs from "fs";
import productModel from "../models/product.js";
import streamifier from "streamifier"
import { getDataUri } from "../utils/features.js";
import { promisify } from "util";
import { Readable } from "stream";


export const photoUploadController=async(req,res)=>{
    try {
        const {height,width,crop,quality} = req.body
        if(!req.file){
            return res.status(401).send({
                success:false,
                message:"File can't read"
            })
        }
        const file = getDataUri(req.file)
        //file compression with transform the height and width to demand on user
        const upload_video = await cloudinary.uploader.upload(file.content,{transformation:[{height:height,width:width,gravity:"faces",crop:crop},{quality:quality,fetch_format: "auto"}]})
        if(!upload_video){
            return res.status(401).send({
                success:false,
                message:"Cannot upload the video"
            })
        }
        res.status(200).send({
            success:true,
            message:"Image Uploaded",
            image:upload_video.secure_url
        })
    } catch (error) {
        
    }
};



export const uploadimage = async (req, res) => {


    // Path to your video file
    const videoPath = 'controllers/video.mp4';

    // const uploadVideoInChunks = async () => {
        const readStream = fs.createReadStream(videoPath, { highWaterMark: 99 * 1024 * 1024 });
        let bytesRead = 99*1024*1024;
        const size = fs.statSync(videoPath).size;
        console.log(readStream)
        console.log(size)
        readStream.on('data', async (chunk) => {
            // let end = Math.min(99 * 1024 * 1024, size)
            console.log(chunk.length);
            let numberPart = 1;
            // while (numberPart <= chunk.length) {
            bytesRead += chunk.length;

            try {
                const uploadResult720 = cloudinary.uploader.upload_stream({
                    resource_type: 'video',
                    eager: [{ format: 'mp4' }],
                    eager_async: true,
                    chunk_size: bytesRead,
                    // transformation: { quality: "72" } 
                }, (error, result) => {
                    if (error) {
                        console.error('Error uploading chunk:', error);
                    } else {

                        console.log(result.secure_url)
                    }
                }).end(chunk);
                // numberPart++
            } catch (error) {
                console.error('Error uploading chunk:', error);
            }
            // };
            // const product = new productModel({
            //     video
            // })
        })
        readStream.on('end', () => {
            console.log('Upload completed');
            res.send({
                success: true,
                message: "Video Uploaded"
            })
        });

        readStream.on('error', (error) => {
            console.error('Error reading file:', error);
        });
    // };





    // uploadVideoInChunks();


}

export const uploadVideo = async (req, res) => {
    try {
        const videoPath = 'controllers/video.mp4';
        const stat = promisify(fs.stat);
        const { size } = await stat(videoPath);
        const partitionSize = fs.statSync(videoPath).size; // Set partition size in bytes (e.g., 1MB)
        const numPartitions = Math.ceil(size / partitionSize);

        // Upload each partition
        for (let i = 0; i < numPartitions; i++) {
            const startPosition = i * partitionSize;
            const endPosition = Math.min((i + 1) * partitionSize, size);
            const partitionSizeBytes = endPosition - startPosition;

            const readStream = fs.createReadStream(videoPath, { start: startPosition, end: endPosition - 1 });

            const uploadResult = await cloudinary.uploader.upload_stream({
                resource_type: 'video',
                eager: [{ format: 'mp4' }], // Adjust eager transformations if needed
                eager_async: true // Enable asynchronous processing
            }, (error, result) => {
                if (error) {
                    return res.status(204).send({
                        success: false,
                        error
                    })
                } else {
                    return res.status(200).send({
                        success: true,
                        url: result.secure_url
                    })
                }
            });

            readStream.pipe(uploadResult, { end: true });
        }
    } catch (error) {
        console.error('Error occurred during upload:', error);
    }
}

// Call the function to start uploading


export const uploadVideoFile = async(req,res)=>{
    
    const videoPath = 'controllers/video.mp4';

// Function to upload video in partitions
async function uploadVideoInPartitions() {
  try {
    const stat = promisify(fs.stat);
    const { size } = await stat(videoPath);
    const partitionSize = 99*1024*1024; // Set partition size in bytes (e.g., 1MB)
    const numPartitions = Math.ceil(size / partitionSize);
    
    // Upload each partition
    for (let i = 0; i < numPartitions; i++) {
        console.log(size)
      const startPosition = i * partitionSize;
      console.log(startPosition)
      const endPosition = Math.min((i + 1) * partitionSize, size);
      console.log(endPosition)
      const partitionSizeBytes = endPosition - startPosition;

      const readStream = fs.createReadStream(videoPath, { start: startPosition, end: endPosition - 1 });
      const buffers = [];

      readStream.on('data', (chunk) => {
        buffers.push(chunk);
      });

      readStream.on('end', async () => {
        const buffer = Buffer.concat(buffers);
        try {
          const bufferStream = new Readable();
          bufferStream.push(buffer);
          bufferStream.push(null);

          const uploadResult = await cloudinary.uploader.upload_stream({
            resource_type: 'video',
            eager: [{ format: 'mp4' }], // Adjust eager transformations if needed
            eager_async: true // Enable asynchronous processing
          }, (error, result) => {
            if (error) {
                // res.send(error)
                console.log(error)
            } else {
                console.log(result)
            }
          });

          bufferStream.pipe(uploadResult);
        } catch (error) {
          console.error('Error uploading partition:', error);
        }
      });

      readStream.on('error', (error) => {
        console.error('Error reading partition:', error);
      });
    }
  } catch (error) {
    console.error('Error occurred during upload:', error);
  }
}

// Call the function to start uploading
uploadVideoInPartitions();

}