import jwt from "jsonwebtoken"
import express, { NextFunction, Request, Response } from "express";
import { Token } from "../models/user/refresh";
import { Users } from "../models/user/user";
import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator";

async function authenticate(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) {
    const accessToken = req.cookies.token1;
    const token = await Token.findOne({ accessToken });
    if (token) {
        jwt.verify(accessToken, "rdm secret access", async (err: any, decoded: any) => {
            if (err) {
                console.log(err);

                if (err.message.includes("jwt expired")) {
                    return res.status(404).json({ err: "token expired" });
                }
                if (err.message.includes("invalid token")) {
                    return res.status(404).json({ err: "invalid token" });
                }
            }
            else {
                console.log("decoded:", decoded.id);
                const user = await Users.findOne({ _id: decoded?.id });
                console.log(user);
                // return res.status(200).json({ msg: "valid token", user });
                next();
            }
        })
    }
    else{
        return res.status(404).json({ err: "invalid token" });
    }


}
export { authenticate };