import {Request,Response,NextFunction} from "express"
import {generateOTP,verifyOTP,otpstorage2} from "../utils/otp"
import {createMessage} from "../utils/twilio"
var OTP = otpstorage2;
async function res_owner_sendotp(req: Request<{}, {}, { MobileNo: string}, {}>, res: Response, next: NextFunction){
    const MobileNo = req.body.MobileNo;
    OTP = generateOTP(4,10*60*1000,MobileNo);
    const otp = OTP[MobileNo].otp
    const message = createMessage(otp,MobileNo);
    res.status(200).json({ message: 'OTP sent for verification' }); 

}
async function res_owner_verifyotp(req: Request<{}, {}, { MobileNo: string, otp: string }, {}>, res: Response, next: NextFunction) {
    const MobileNo = req.body.MobileNo;
    const otp = req.body.otp;
    const storedOtp = OTP[MobileNo];
    const result = verifyOTP(storedOtp, otp);
    try {
        const result = await verifyOTP(storedOtp, otp);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}
export{res_owner_sendotp,res_owner_verifyotp}