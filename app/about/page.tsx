export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>
        JobNote is a free-to-use web application that optimizes your resume for
        a given job posting. Using vector embeddings, JobNote compares the
        semantic meaning of entries in your resumé with entries in the job
        posting. Then, only the most relevant lines of your resumé are included
        in the generated word document, giving you the best chance at the
        automated systems at big organizations passing your resumé to an actual
        human.
      </p>
      <p>
        To be clear: JobNote is not using any <strong>Generative AI</strong>. To
        repeat: <strong>JobNote is not using any Generative AI</strong>. You
        write all of your own resumé entries; analytical AI is used to refine
        your resumé to the best instance for a particular job. This is a more
        efficient way of using AI, and, we believe, more ethical, too.
      </p>
    </main>
  )
}
