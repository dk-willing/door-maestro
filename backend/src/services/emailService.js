const nodemailer = require("nodemailer");

function createEmailService(db) {
  function getEmailSettings() {
    try {
      const row = db
        .prepare("SELECT value FROM settings WHERE key = ?")
        .get("email_notifications");
      return row ? JSON.parse(row.value) : null;
    } catch {
      return null;
    }
  }

  function createTransporter(settings) {
    if (
      !settings ||
      !settings.enabled ||
      !settings.smtpHost ||
      !settings.smtpUser ||
      !settings.smtpPass
    ) {
      return null;
    }

    return nodemailer.createTransport({
      host: settings.smtpHost,
      port: parseInt(settings.smtpPort, 10) || 587,
      secure: parseInt(settings.smtpPort, 10) === 465,
      auth: { user: settings.smtpUser, pass: settings.smtpPass },
    });
  }

  async function sendOrderNotification(order, product) {
    const settings = getEmailSettings();
    if (!settings || !settings.enabled || !settings.recipientEmail) {
      return;
    }

    const transporter = createTransporter(settings);
    if (!transporter) {
      return;
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0A0A;color:#E0E0E0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#C8A84E,#A68A3E);padding:24px 32px;">
          <h1 style="margin:0;color:#000;font-size:22px;">New Order Received</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#C8A84E;margin:0 0 16px;">${order.product_name}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;">Quantity</td><td style="padding:8px 0;color:#E0E0E0;text-align:right;">${order.quantity}</td></tr>
            ${product ? `<tr><td style="padding:8px 0;color:#888;">Unit Price</td><td style="padding:8px 0;color:#E0E0E0;text-align:right;">$${Number(product.price).toLocaleString()}</td></tr>` : ""}
            ${product ? `<tr><td style="padding:8px 0;color:#888;">Total</td><td style="padding:8px 0;color:#C8A84E;font-weight:bold;text-align:right;">$${(product.price * order.quantity).toLocaleString()}</td></tr>` : ""}
            <tr><td colspan="2" style="padding:12px 0;border-top:1px solid #2A2A2A;"></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Customer</td><td style="padding:8px 0;color:#E0E0E0;text-align:right;">${order.customer_name}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;color:#E0E0E0;text-align:right;">${order.phone}</td></tr>
            ${order.note ? `<tr><td style="padding:8px 0;color:#888;">Note</td><td style="padding:8px 0;color:#E0E0E0;text-align:right;">${order.note}</td></tr>` : ""}
          </table>
        </div>
        <div style="padding:16px 32px;background:#141414;text-align:center;color:#888;font-size:12px;">
          Door Maestro Admin - Manage this order in your dashboard
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: settings.fromEmail || settings.smtpUser,
        to: settings.recipientEmail,
        subject: `New Order: ${order.product_name} (Qty: ${order.quantity})`,
        html,
      });
      console.log("Order notification email sent to", settings.recipientEmail);
    } catch (err) {
      console.error("Failed to send email notification:", err.message);
    }
  }

  async function sendTestEmail(settings) {
    const transporter = createTransporter(settings);
    if (!transporter) {
      throw new Error("Invalid SMTP settings");
    }

    await transporter.sendMail({
      from: settings.fromEmail || settings.smtpUser,
      to: settings.recipientEmail,
      subject: "Door Maestro - Test Email",
      html: '<div style="font-family:Arial;padding:20px;"><h2 style="color:#C8A84E;">Email notifications are working!</h2><p>You will receive order notifications at this address.</p></div>',
    });
  }

  return {
    getEmailSettings,
    sendOrderNotification,
    sendTestEmail,
  };
}

module.exports = { createEmailService };
