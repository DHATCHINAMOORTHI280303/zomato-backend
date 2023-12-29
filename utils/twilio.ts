import { Twilio } from "twilio";
const accountSid = "AC166dfae69dc474242e426e7c077c3a6a";
const authToken = "e3b772f5729483de6389cdea5a54ef23";
const twilio = new Twilio(accountSid, authToken);
async function createMessage(otp: string, MobileNo: string) {
    return await twilio.messages.create({
        body: `Your OTP is: ${otp}`,
        from: "+12403396762",
        to: MobileNo,
    });
}
export { createMessage };