import Link from 'next/link'

export default function VerifyEmailBanner() {
  return (
    <div>
      <p>
        Your account has not been verfied. Until it is, you will be unable to
        fully use JobNote. Make sure to check your spam folder.
      </p>
      <Link href='/verify/resend'>Resend Link</Link>
    </div>
  )
}
