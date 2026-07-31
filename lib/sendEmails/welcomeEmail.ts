import { generateWelcomeEmail } from "@/components/userAdmin/emails/WelcomeEmail";
import { sendingEmail } from "@/utils/resend/sendEmail";

interface WelcomeEmailProps {
  branchName: string;
  email: string
}

export const welcomeEmail = async ({  branchName, email }: WelcomeEmailProps) => { 
  const htmlContent = generateWelcomeEmail({ restaurantName:branchName  })
  
  
  await sendingEmail(
    {
        from: 'Qtend <onboarding@getqtend.com>',
        to: email,
        subject: 'Welcome to Qtend 🎉',
        html: htmlContent
    }
  )
}
