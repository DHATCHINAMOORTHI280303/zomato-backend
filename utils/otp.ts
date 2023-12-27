import randomstring from "randomstring";

const otpstorage: Record<string, { otp: string; expiresAt: number }> = {};

const otpstorage2: Record<string, { otp: string; expiresAt: number }> = {};

function generateOTP(length:number,expires:number,MobileNo:string):Record<string, { otp: string; expiresAt: number}>{
    const otp:string= randomstring.generate({ length, charset: 'numeric' });
    const expiresAt = Date.now() +  expires;
    return { MobileNo: { otp, expiresAt } };
  
}
async function verifyOTP(storedOtp:any,otp:string){

    if (!storedOtp || storedOtp.expiresAt < Date.now()) {
        throw new Error('OTP expired or invalid' );
    }

    if (storedOtp.otp !== otp) {
        throw new Error('Invalid OTP');
    }
    return{msg:"valid OTP"}
    

}

export{generateOTP,verifyOTP,otpstorage,otpstorage2};