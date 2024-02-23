function errorHandler (err, req, res, next) {
    return res.status(401).json({
        success:false,
        message:err.message
    })
  }
  
// export const errorHandler = async ( req, res,) => {
//     console.log(req)
//     const statusCode = req.status ?? 401
//     const message = req.error
//     console.log(statusCode, message)
//     // console.log(err)
//     const error = {
//         success: false,
//         message: message
//     }
//     if (!res || !res.status || !res.send) {
//         console.error("Invalid response object passed to errorHandler");
//         next(); // Exit gracefully
//     }
//     res.status(401).send(error);
// }
export default errorHandler