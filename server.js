import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger-output.json" with { type: "json" };
import fs from "fs"
import pino from "pino";
import winston from "winston";
import './utils/passport.js'
import session from "express-session";
import passport from 'passport';
import {v2 as cloudinary} from 'cloudinary';
import ejs from 'ejs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function isLoggedIn(req,res,next){
    req.user?next():res.sendStatus(401);
}

//cloudinary
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//pino logger
const logger = pino()
//winston logger
const logger1 = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});


dotenv.config();
const app = express();
connectDB();
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"))
app.use(cors());
//passport
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));
app.get('/auth/google/success',isLoggedIn,(req,res)=>{
    res.send("something went right"+ req.user.displayName)
})
app.get('/auth/google/failure',(req,res)=>{
    res.send("something went wrong")
})

//to save the logger in the text file *********
const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' }) // create a write stream (in append mode)
app.use(morgan('[:date[clf]] :method :url :status :response-time ms - :res[content-length]', { stream: accessLogStream }))


//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

//routes 
import routers from './routes/index.js'
app.use('/api/v1',routers)


app.get("/", (req, res) => {
    // res.status(200).send({
    //     success: true,
    //     message: "run successfully"
    // })
    res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, (error, res) => {
    logger.info("server run")
    if (error) {
        logger1.error("server run")
    }
})