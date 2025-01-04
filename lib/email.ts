import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`

  await resend.emails.send({
    from: 'JobNote <no-reply@jobnote.app>',
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  })
}
