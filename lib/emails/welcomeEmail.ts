import User from "@/utils/models/User" 
import { sendingEmail } from "@/utils/resend/sendEmail";

interface WelcomeEmailProps {
  email: string;
  branchName: string;
}

export const welcomeEmail = async ({ email, branchName }: WelcomeEmailProps) => { 
  console.log('Sending email to:', email, branchName);
  
  
  await sendingEmail(
    {
        from: '',
        to: '',
        subject: '',
        html: ''
    }
  )
}
