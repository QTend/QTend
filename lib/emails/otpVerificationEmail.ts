import { sendingEmail } from "@/utils/resend/sendEmail";

interface OtpEmailProps {
  email: string;
  branchName: string;
  otp: string
}

export const optVerificationEmail = async({ email, branchName, otp }: OtpEmailProps) => {
    console.log('Sending otp email to:', email, branchName);

    await sendingEmail( {
        from: '',
        to: '',
        subject: '',
        html: ''
    })
}