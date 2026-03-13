import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Twilio env vars are missing");
}

const client = twilio(accountSid, authToken);

export async function sendOtp(phoneE164: string) {
  return client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({
      to: phoneE164,
      channel: "sms",
    });
}

export async function checkOtp(phoneE164: string, code: string) {
  return client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({
      to: phoneE164,
      code,
    });
}