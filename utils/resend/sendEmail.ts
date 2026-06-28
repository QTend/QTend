import { resend } from "./resend"

export const sendingEmail = async ({
    from,
    to,
    html,
    subject
}: {
    from: string;
    to: string;
    html: string;
    subject: string;
    }) => {
        try {
        const data = await resend.emails.send({
        from,
        to,
        subject,
        html,
        });
        return data;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}