// utils/emailTemplates.ts

import { renderEmailFooter, renderEmailHeader } from "@/utils/emailComponents";

interface ForgotPasswordOtp {
  otp: string

}

export const generateForgotPasswordOtpEmail = ({  otp }: ForgotPasswordOtp) => {
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
                                <h1 style="margin: 0 0 24px; font-size: 24px; color: #111827; font-weight: 700;">Forgot password OTP</h1>
                                
                                <p style="margin: 0 0 16px;">Use this OTP to confirm change of password</p>
                                
                                <p style="margin: 0 0 16px; font-weight: 600; background-color: #F67D26; font-size: 24px; color: #ffffff; padding: 7px 16px; border-radius: 8px; width: fit-content;">${otp}</p>



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