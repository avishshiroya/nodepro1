import fs from "fs"
import { ChildProcess, exec } from 'child_process'
import path from "path";
import ffmpegPath from "ffmpeg-static";
import {v2 as cloudinary} from "cloudinary"
import { getDataUri } from "../utils/features.js";
import multer from "multer";
export const VideoUploadmanually2 = async (req, res) => {
    try {
        // const fileChange = path.dirname(req.file);
        // console.log(fileChange)
        console.log(req.body)
        const data = req.body
        const file = req.file.path
        return res.status(200).json({ data, file })
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            // success: false,
            message: "Error in video upload",
            error
        })
    }
}

export const uploadVideomanually =  (req, res) => {

const compressVideo =(inputPath, outputPath, bitrate = '1000k', callback)=> {
    const ffmpegCmd = `"${ffmpegPath}" -i "${inputPath}" -b:v ${bitrate} "${outputPath}"`;
    // const ffmpegCmd = `${ffmpegPath} -i ${inputPath} -c:v libx264 -crf 23 -c:a aac -strict -2 -b:a 500k ${outputPath}`;

    console.log(ffmpegCmd)
    
    console.log("upload")
    exec(ffmpegCmd,  async (error, stdout, stderr) => {
        console.log(stdout)
        if (error) {
            console.error(`Error: ${error.message}`);
            callback(error);
            return res.status(401).send({
                success:false,
                message:"can't compress video",
                error
            });
        }
        if (stderr) {
            console.error(`ffmpeg stderr: ${stderr}`);
            callback(stderr);
            return res.status(401).send({
                success:false,
                message:"can't compress video",
                stderr
            });
        }
        console.log("in running")
        // multer()
        //  const file= getDataUri(outputPath)
         console.log(file)
       const upload = await cloudinary.uploader.upload_large(outputPath, { resource_type: 'video'},
        (err, result) => {
            if (err) {
                console.error('Cloudinary upload error:', err);
                callback(err);
            } else {
                console.log('Video uploaded to Cloudinary:', result.secure_url);
                callback(null, result.secure_url);
            }
        });
        // fs.unlink(outputPath)
        res.send(`Video compression successful. Output: ${upload.secure_url}`);
        
    });
}

// Example usage
const inputFilePath = 'photos/video.mp4';
const outputFilePath = 'photos/output_compressed_video.mp4';

compressVideo(inputFilePath, outputFilePath, '500k', (error) => {
    if (error) {
        console.error('Video compression failed:', error);
    } else {
        console.log('Video compression successful!');
    }
});

//     const file = req.file
//     console.log(req.file)
//     const tempFilePath = "photos/video.mp4";
//     const outputfilename = "photos/upload_video.mp4";
//    const comp = exec(ffmpegPath, [
//         '-i', tempFilePath,
//         '-s', '640x480',
//         '-b:v', '512k',
//         '-c:v', 'mpeg1video',
//         '-c:a', 'copy',
//         outputfilename
//     ], function(error, stdout, stderr) {
//       if(error){
//         return res.status(401).send({
//             success:false,
//             message:"error in the File Compression"
//         })
//       }else{
//         console.log(stdout,stderr)
//       }
//     })
//     console.log(comp)
    
// const splitVideo = (inputPath,outputPath,chunkDuration)=>{
//     return new Promise((resolve,reject)=>{
//         const command = `ffmpeg -i ${inputPath} -c copy -map 0 -segment_time ${chunkDuration} -f segment ${outputPath}`;
//         exec(command,(error,stdout,stderr)=>{
//             if(error){
//                 console.error(`error in spliting video: ${error}`)
//                 reject(error)
//             }else{
//                 console.log("video splited successfully");
//                 resolve();
//             }
//         })
//     })


// const uploadchunks = (chunkFolder, uploadFolder) => {
//     fs.readdir(chunkFolder, (err, files) => {
//         if (err) {
//             console.error(`error in reading chunks folder: ${err}`)
//             return;
//         }
//         files.forEach((file) => {
//             const filepath = path.join(chunkFolder, file);
//             fs.copyFile(filepath, path.join(uploadFolder, file), (err) => {
//                 if (err) {
//                     console.error(`error in uploading chunks :${file}, ${err}`)

//                 } else {
//                     console.log(`Chunk ${file} uploaded successfully`)
//                 }
//             })
//         })
//     })
// }

// const inputVideopath = 'photos/video.mp4'
// const outpotChunkpath = '/chunks'
// const chunkDuration = 20 * 60;
// const uploadFolder = '/uploadVideo';

// splitVideo(inputVideopath, outpotChunkpath, chunkDuration).then(() => {
//     uploadchunks('./chunks', uploadFolder)
// }).catch((error) => {
//     console.log(`error:${error}`)
// })
}
