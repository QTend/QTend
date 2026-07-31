// utils/emailTemplates.ts

import { renderEmailFooter, renderEmailHeader } from "@/utils/emailComponents";

interface WelcomeEmailProps {
  restaurantName: string;
  // You can add more variables here later, like 'dashboardUrl'
}

export const generateWelcomeEmail = ({ restaurantName }: WelcomeEmailProps) => {
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
                                <h1 style="margin: 0 0 24px; font-size: 24px; color: #111827; font-weight: 700;">Welcome.</h1>
                                
                                <p style="margin: 0 0 16px;">Hello ${restaurantName},</p>
                                
                                <p style="margin: 0 0 16px; font-weight: 600;">Welcome to Qtend! 🎉</p>
                                <p style="margin: 0 0 16px;">Your account has been successfully created, and you're now one step closer to delivering a faster, smarter dining experience for your guests.</p>
                                <p style="margin: 0 0 16px;">With Qtend, your customers can simply scan a QR code at their table, browse your digital menu, and place orders directly from their phones.</p>
                                
                                <p style="margin: 0 0 16px; font-weight: 600;">What's Next?</p>
                                <p style="margin: 0 0 12px;">Getting started takes just a few minutes:</p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px;">
                                    <tr><td width="20" valign="top" style="padding-top: 2px; color: #68A544;">•</td><td style="padding-bottom: 8px;">Set up your business profile</td></tr>
                                    <tr><td width="20" valign="top" style="padding-top: 2px; color: #68A544;">•</td><td style="padding-bottom: 8px;">Upload and organize your menu items</td></tr>
                                    <tr><td width="20" valign="top" style="padding-top: 2px; color: #68A544;">•</td><td style="padding-bottom: 8px;">Generate and print your table QR codes</td></tr>
                                    <tr><td width="20" valign="top" style="padding-top: 2px; color: #68A544;">•</td><td style="padding-bottom: 8px;">Start receiving orders directly from your customers</td></tr>
                                </table>

                                <p style="margin: 0 0 16px;">Whether you run a restaurant, café, lounge, bar, or hotel, Qtend helps you streamline operations, reduce wait times, and serve more customers efficiently.</p>
                                <p style="margin: 0 0 24px;">If you need assistance at any point, our team is here to help.</p>
                                <p style="margin: 0 0 24px;">We're excited to be part of your journey and can't wait to see your business thrive with Qtend.</p>
                                <p style="margin: 0 0 8px;">Welcome aboard!</p>
                                <p style="margin: 0;">Best regards,<br><strong style="color: #111827;">The Qtend Team</strong></p>
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