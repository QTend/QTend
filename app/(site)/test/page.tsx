import { generateForgotPasswordOtpEmail } from "@/components/userAdmin/emails/ForgotPasswordOtpEmail";
// import { generateVerifyOptEmail } from "@/components/userAdmin/emails/VerifyOtpEmail";
// import { generateWelcomeEmail } from "@/components/userAdmin/emails/WelcomeEmail";


export default function EmailTestPage() {
  const htmlContent = generateForgotPasswordOtpEmail({ 
    otp: '123456'
  });

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8">
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Email Sandbox</h1>
        <p className="text-neutral-400 text-sm">Previewing: Welcome Email</p>
      </div>

      {/* 2. The Sandbox Container (Set to 600px to mimic desktop email clients) */}
      <div className="w-full max-w-150 h-200 bg-white shadow-2xl rounded-xl overflow-hidden border border-neutral-700 resize-x overflow-auto">
        
        {/* 3. The iframe safely isolates the HTML */}
        <iframe 
          srcDoc={htmlContent} 
          className="w-full h-full border-none bg-white"
          title="Email Preview"
        />
        
      </div>
      
      <p className="text-neutral-500 text-xs mt-4">
        *Tip: Use the bottom-right corner of the white box to drag and resize the width to test mobile responsiveness!
      </p>

    </div>
  );
}