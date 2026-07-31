// utils/emailTemplates.ts

import { renderEmailFooter, renderEmailHeader } from "@/utils/emailComponents";

interface VerifyOtpEmail {
  otp: string
}

export const generateVerifyOptEmail = ({ otp }: VerifyOtpEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Qtend</title>
        </head>
    <body style="margin: 0; padding: 0; background-color: #F4F4F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4F4F5; padding: 40px 0; align="center"">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #FFFFFF; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
                         ${renderEmailHeader()} 

                        <tr>
                            <td style="padding: 40px; color: #333333; line-height: 1.6; font-size: 16px;">
                                <h1 style="margin: 0 0 24px; font-size: 24px; color: #111827; font-weight: 700;">Verify Your Email Address.</h1>
                                
                                <p style="margin: 0 0 16px;">Hello,</p>
                                
                                <p style="margin: 0 0 16px;">Thank you for signing up:</p>
                                <p style="margin: 0 0 16px;">To verify your email address and complete your account setup, please enter the verification code below:</p>
                                
                               <p style="margin: 0 0 16px; font-weight: 600; background-color: #F67D26; font-size: 24px; color: #ffffff; padding: 7px 16px; border-radius: 8px; width: fit-content;">${otp}</p>

                                <p style="margin: 0 0 16px;">This code will expire in 10 minutes.</p>
                                <p style="margin: 0 0 16px;">If you did not create an account, you can safely ignore this email.</p>


                            </td>
                        </tr>
                    </table>

                    <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
                        ${renderEmailFooter()}
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};