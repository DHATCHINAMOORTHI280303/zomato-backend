import jwt from "jsonwebtoken"
import express, { NextFunction, Request, Response } from "express";
import {Token} from "../models/refresh"
import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator";

async function authenticate(req:Request,res:Response,next:NextFunction){
    
     
    
   
}

module.exports = authenticate