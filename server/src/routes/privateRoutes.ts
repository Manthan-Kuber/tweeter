import express, {Request, Response, NextFunction } from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";


router.get("/test",requireAuth,(req:Request,res:Response,next:NextFunction) => {
    res.status(200).json({
        success:true,
        message:"You are Authorized!"
    })
});


export default router;