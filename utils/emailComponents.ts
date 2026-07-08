interface EmailHeaderProps {
  logoUrl?: string;
  tagline?: string;
  graphicUrl?: string;
  graphicWidth?: number;
}

export const renderEmailHeader = ({
  logoUrl = "https://res.cloudinary.com/dborozfgg/image/upload/v1783350036/transparent_logo_drtu6o.png",
  tagline = "Smart dining for smart businesses.",
  graphicUrl = "https://res.cloudinary.com/dborozfgg/image/upload/v1783350208/emailIcon_u8zilc.png",
  graphicWidth = 150
}: EmailHeaderProps = {}) => {
  return `
    <tr>
        <td style="background-color: #68A544; padding: 30px 40px 10px; text-align: left;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="60%" style="vertical-align: middle;">
                        <img src="${logoUrl}" alt="Qtend Logo" width="120" style="display: block; border: 0;" />
                        <p style="margin: 20px 0 0; color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 500; font-style: italic;">${tagline}</p>
                    </td>
                    <td width="40%" align="right" style="vertical-align: bottom;">
                        <img src="${graphicUrl}" alt="Header Graphic" width="${graphicWidth}" style="display: block; border: 0; border-radius: 4px;" />
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;
};



export const renderEmailFooter = () => {
    return `
    <tr>
        <td style="padding: 30px 40px; color: #000000; font-size: 13px; line-height: 1.5; text-align: left;">
            <p style="margin: 0 0 16px;">Learn more:<br><a href="https://www.getqtend.com" style="color: #EF7939; text-decoration: underline;">www.getqtend.com</a> or read our <a href="https://getqtend.com#faq" style="color: #1677FF; text-decoration: underline;">FAQs</a></p>
            <p style="margin: 0 0 16px;">If you have any questions or need help with your setup, please send us an email. We're here to help you, literally!</p>
            <p style="margin: 0 0 16px; color:#777777;">Contact us:<br><a href="mailto:hello@getqtend.com" style="color: #68A544; text-decoration: none;">hello@getqtend.com</a></p>
            <p style="margin: 0 0 16px; font-size: 12px;">If you received this email without registering for any of our services, please contact us and delete this email immediately.</p>
            <p style="margin: 0;"><a href="https://getqtend.com/terms" style="color: #1677FF; text-decoration: underline;">Terms of Use</a> &nbsp;|&nbsp; <a href="https://getqtend.com/privacy" style="color: #1677FF; text-decoration: underline;">Privacy Policy</a></p>
        </td>
    </tr>
    `
}
