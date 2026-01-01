
/**
 * RESEND EMAIL SERVICE
 * Note: Direct browser-to-API calls are often blocked by CORS for security.
 * In production, this should be moved to a Firebase Cloud Function.
 */

const RESEND_API_KEY = "re_KPy4qqxT_GXKkvyJajhjLBmhaJUvA1Pfd";

export interface EmailStatus {
  success: boolean;
  recipient: string;
  subject: string;
  html: string;
  error?: string;
}

export const sendEmailNotification = async (to: string, subject: string, html: string): Promise<EmailStatus> => {
  console.log(`[Email Service] Target: ${to}`);
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SmartLib System <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return { success: true, recipient: to, subject, html };
  } catch (error: any) {
    console.warn('[Email CORS/Network Notice] Physical email delivery failed. This is expected in a browser-only environment due to Resend security policies.');
    return { 
      success: false, 
      recipient: to, 
      subject, 
      html,
      error: error.message === 'Failed to fetch' ? 'CORS Blocked' : error.message 
    };
  }
};

export const notifyBorrow = (email: string, bookName: string, returnDate: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px; color: #334155;">
      <h2 style="color: #4f46e5; margin-bottom: 5px;">Book Issue Receipt</h2>
      <p style="font-size: 14px; color: #64748b;">SmartLib Management System</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p>The following resource has been checked out to: <strong>${email}</strong></p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em;">Resource Title</span>
        <div style="font-size: 18px; font-weight: 900; color: #1e293b; margin-top: 4px;">${bookName}</div>
      </div>
      <p style="font-size: 14px;">Please ensure the resource is returned by:</p>
      <div style="font-size: 24px; font-weight: 900; color: #e11d48;">${returnDate}</div>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 40px; text-align: center;">
        Automated Security Notification • SmartLib Pro
      </p>
    </div>
  `;
  return sendEmailNotification(email, `Issue Receipt: ${bookName}`, html);
};

export const notifyReturn = (email: string, bookName: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px; color: #334155;">
      <h2 style="color: #10b981; margin-bottom: 5px;">Return Confirmation</h2>
      <p style="font-size: 14px; color: #64748b;">SmartLib Management System</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
      <p>Resource returned successfully:</p>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #dcfce7;">
        <div style="font-size: 18px; font-weight: 900; color: #065f46;">${bookName}</div>
      </div>
      <p>The transaction for <strong>${email}</strong> is now closed.</p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 40px; text-align: center;">
        Thank you for using our library services.
      </p>
    </div>
  `;
  return sendEmailNotification(email, `Return Confirmation: ${bookName}`, html);
};
