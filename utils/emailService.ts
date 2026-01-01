import emailjs from '@emailjs/browser';

const SERVICE_ID = "service_glwx52o";
const TEMPLATE_ID = "template_ra1vuvn";
const PUBLIC_KEY = "cSl6v4JdZvhh-hpcR";

export interface EmailStatus {
  success: boolean;
  recipient: string;
  subject: string;
  html: string;
  error?: string;
}

export const sendEmailNotification = async (to: string, templateParams: any): Promise<EmailStatus> => {
  console.log(`[Email Service] Sending to: ${to}`, templateParams);

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('[Email Service] Success:', result.text);
    return { success: true, recipient: to, subject: "Notification Sent", html: "Email sent via EmailJS" };
  } catch (error: any) {
    console.error('[Email Service] Shifted to Fallback:', error);
    return {
      success: false,
      recipient: to,
      subject: "Failed",
      html: "",
      error: error.text || "EmailJS Error"
    };
  }
};

export const notifyBorrow = (email: string, bookName: string, returnDate: string) => {
  // We send the raw data, the HTML template is now formatted inside EmailJS dashboard
  const params = {
    email: email,
    bookName: bookName,
    returnDate: returnDate,
    to_name: email.split('@')[0]
  };

  // Return the promise directly
  return sendEmailNotification(email, params);
};

export const notifyReturn = (email: string, bookName: string) => {
  // Reuse the same template but maybe indicate return context if template allows, 
  // or just send the book name and email. 
  // Note: The current EmailJS template is hardcoded for "Issue Confirmation". 
  // You might want to create a SECOND template for Returns later.
  // For now, we will send it using the same params, but it might look like an Issue receipt.

  const params = {
    email: email,
    bookName: bookName,
    returnDate: "RETURNED", // Marking as returned
    to_name: email.split('@')[0]
  };

  return sendEmailNotification(email, params);
};
