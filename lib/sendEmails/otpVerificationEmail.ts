import { generateVerifyOptEmail } from "@/components/userAdmin/emails/VerifyOtpEmail";
import { sendingEmail } from "@/utils/resend/sendEmail";

interface OtpEmailProps {
  email: string;
  otp: string
}

export const optVerificationEmail = async({ email, otp }: OtpEmailProps) => {

    const htmlContent = generateVerifyOptEmail({ otp })
    
    await sendingEmail( {
        from: 'Qtend <onboarding@getqtend.com>',
        to: email,
        subject: 'Verify your Qtend account 🎉',
        html: htmlContent
    })
}