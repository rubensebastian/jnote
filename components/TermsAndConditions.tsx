export default function TermsAndConditions() {
  return (
    <>
      <h1>Terms and conditions</h1>
      <p>
        JobNote is a web application to assist with your job search. By using
        this service, you agree to the following terms.
      </p>
      <p>
        Use of this web application, JobNote, is for humans only. You may not
        use JobNote for any automated purposed, as part of a part, or any other
        non-human use not described above.
      </p>
      <p>
        This web application uses analytical AI (<em>not</em> generative AI) to
        optimize your resumé based on the job descriptions you have added to
        your full resumé. Specifically, it uses several libraries from
        HuggingFace&apos;s Transformers to convert text into mathematical
        representations (vectors) that a computer can use to compare similarity.{' '}
        <strong>
          If you are not comfortable with this for any reason: Do not use this
          service.
        </strong>{' '}
        Use of this service acknowledges your consent.
      </p>
      <p>
        Violation of any of these rules may result in immediate termination of
        your account without warning. If you have a paid plan, you will not be
        reimbursed, even partially, for the cost of the plan.
      </p>
      <h2>Browser Extension/Plugin</h2>
      <p>
        The Jobnote extension (Chrome) or plugin (Firefox) is available for use
        by users with a JobNote account of any tier (including the free tier).
        Like the JobNote web application, you may not use any bots or other
        automated approaches—it is only to be used by you, the human.
      </p>
      <p>
        Please note: if you are using the paid plans (Pro or Premium), there is
        an option to parse job data from a page. This option, which is
        completely optional, uses OpenAI&apos;s Chat API to get structured data
        output. None of your data is sent in this transaction; only the text
        from the job posting.
      </p>
      <h2>Data and Cookies</h2>
      <p>
        We do not track any of your data. We do not use any cookies to track you
        or sell your data. The only cookie on this web application is to keep
        you signed in.
      </p>
      <h2>Future Proofing</h2>
      <p>
        If any information in this document should change, you will be notified
        by email of the changes. You may, at that point, delete your JobNote
        account without repercussion. If you choose to continue using your
        JobNote account after that point, it will be considered consent to the
        new Terms and Conditions and its changes.
      </p>
    </>
  )
}
