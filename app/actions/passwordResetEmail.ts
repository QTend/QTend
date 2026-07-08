import { generateForgotPasswordOtpEmail } from "@/components/userAdmin/emails/ForgotPasswordOtpEmail";
import { sendingEmail } from "@/utils/resend/sendEmail";

interface ResetEmailProps {
  email: string;
  otp: string;
}

export const passwordResetEmail = async ({ email, otp }: ResetEmailProps) => { 
  const htmlContent = generateForgotPasswordOtpEmail({ otp }) 
  
  await sendingEmail({
    from: 'Qtend <security@getqtend.com>',
    to: email,
    subject: 'Reset your Qtend password',
    html: htmlContent
  });
}