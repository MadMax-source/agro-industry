import 'server-only'
import nodemailer from 'nodemailer'

export async function sendContactEmail(input: { name: string; email: string; phone?: string; message: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, MAIL_FROM, MAIL_TO } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !MAIL_FROM || !MAIL_TO) {
    throw new Error('SMTP environment variables are not fully configured.')
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  })

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    replyTo: input.email,
    subject: `Website enquiry from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || 'Not provided'}`,
      '',
      input.message,
    ].join('\n'),
  })
}
