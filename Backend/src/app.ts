import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
const app: Application=express();
app.use(cors());

import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
}




app.use((err:AppError,req: Request,res: Response,next: NextFunction)=>{

    console.error(err.message);

    const status=err.status||500;

    res.status(status).json({
        success: false,
        message: err.message
    })
});
module.exports=app;