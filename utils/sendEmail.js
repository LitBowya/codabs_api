// utils/emailSender.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const createEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container { margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .header { background: linear-gradient(45deg, #2563eb, #3b82f6); padding: 2rem; text-align: center; }
    .logo { color: white; font-size: 2rem; font-weight: bold; }
    .content { padding: 0.75rem; background: #f8fafc; }
    .message { background: white; padding: 0.75rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 1.125rem }
    .footer { text-align: center; padding: 1rem; color: #64748b; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Codabs Construction</div>
    </div>
    
    <div class="content">
      <div class="message">
        ${content.replace(/\n/g, "<br>")}
      </div>
    </div>
    
    <div class="footer">
      © ${new Date().getFullYear()} Codabs Constructions. All rights reserved.<br>
      Need help? Contact support@yourcompany.com
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"Codabs Constructions" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html: createEmailTemplate(text),
  };

  return transporter.sendMail(mailOptions);
};

export const receiveEmail = async ({
  name,
  telephone,
  from,
  subject,
  message,
}) => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
      .email-container { max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden; }
      .header { background: #1a365d; padding: 20px; color: white; }
      .logo { font-size: 24px; font-weight: bold; }
      .content { padding: 25px; background: #f9f9f9; }
      .message-box { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
      .detail-row { margin-bottom: 15px; }
      .detail-label { font-weight: bold; color: #1a365d; display: inline-block; width: 100px; }
      .message-content { background: #f5f5f5; padding: 15px; border-left: 3px solid #1a365d; margin-top: 20px; font-size: 16px; }
      .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="logo">CODABS CONSTRUCTIONS</div>
        <div style="font-size: 16px;">New Contact Message</div>
      </div>
      
      <div class="content">
        <div class="message-box">
          <div class="detail-row">
            <span class="detail-label">From:</span>
            ${name} &lt;${from}&gt;
          </div>
          
          ${
            telephone
              ? `
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            ${telephone}
          </div>
          `
              : ""
          }
          
          <div class="detail-row">
            <span class="detail-label">Subject:</span>
            ${subject || "No subject"}
          </div>
          
          <div class="message-content">
            ${message}
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>This message was sent via your website contact form</p>
        <p>&copy; ${new Date().getFullYear()} Codabs Constructions. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"${name}" <${from}>`,
    to: `"Codabs Constructions" <${process.env.GMAIL_USER}>`,
    subject: subject || `New message from ${name}`,
    text: message,
    html: htmlTemplate,
  };

  return transporter.sendMail(mailOptions);
};
