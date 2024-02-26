import fs from "fs"
import {exec} from 'child_process'
import path from "path"
export const VideoUploadmanually2 = async (req,res)=>{
    try {
        // const fileChange = path.dirname(req.file);
        // console.log(fileChange)
        console.log(req.body)
        const data = req.body
        const file = req.file.path
        return res.status(200).json({data,file})
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success:false,
            message:"Error in video upload",
            error
        })
    }
}

export const uploadVideomanually = (req,res)=>{
const splitVideo = (inputPath,outputPath,chunkDuration)=>{
    return new Promise((resolve,reject)=>{
        const command = `ffmpeg -i ${inputPath} -c copy -map 0 -segment_time ${chunkDuration} -f segment ${outputPath}`;
        exec(command,(error,stdout,stderr)=>{
            if(error){
                console.error(`error in spliting video: ${error}`)
                reject(error)
            }else{
                console.log("video splited successfully");
                resolve();
            }
        })
    })
}

const uploadchunks = (chunkFolder,uploadFolder)=>{
    fs.readdir(chunkFolder,(err,files)=>{
        if(err){
            console.error(`error in reading chunks folder: ${err}`)
            return;
        }
    files.forEach((file)=>{
        const filepath = path.join(chunkFolder,file);
        fs.copyFile(filepath,path.join(uploadFolder,file),(err)=>{
            if(err){
                console.error(`error in uploading chunks :${file}, ${err}`)

            }else{
                console.log(`Chunk ${file} uploaded successfully`)
            }
        })
    })
    })
}

const inputVideopath = 'photos/video.mp4'
const outpotChunkpath = '/chunks'
const chunkDuration = 20*60;
const uploadFolder = '/uploadVideo';

splitVideo(inputVideopath,outpotChunkpath,chunkDuration).then(()=>{
    uploadchunks('./chunks',uploadFolder)
}).catch((error)=>{
    console.log(`error:${error}`)
})
}
