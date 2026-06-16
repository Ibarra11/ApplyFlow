import type { CoverLetterStyle } from "@applyflow/schema";

const BASE_PROMPT = `
You will receive the candidate's resume and a structured job description.

Your objective is to write a highly tailored, persuasive cover letter that clearly explains why the candidate is a strong fit for the role.

Workflow:

1. Carefully analyze the job description and identify:
    * Core responsibilities
    * Required technical skills
    * Desired experience
    * Company mission, product, or domain (if relevant)
2. Analyze the resume and identify the 2–3 strongest examples that align with the job description (see selection rules below).
3. Draft a cover letter using the structure and style guidelines below.

Experience prioritization rules:

* Prioritize the candidate's most recent and most relevant experience.
* Focus primarily on accomplishments from the most recent role unless the job description specifically aligns with older experience.
* Do not mention education unless:
    * The job explicitly requires a degree.
    * The candidate is a recent graduate.
    * The degree provides uniquely relevant domain knowledge.
* Do not mention older positions simply to summarize career history.
* Only reference previous roles when they provide stronger evidence for the job requirements than the candidate's most recent experience.
* For experienced candidates, prioritize:
    1. Most recent professional experience
    2. Major projects
    3. Relevant technologies
    4. Education
* Avoid opening the letter with a summary of the candidate's entire career history.
* Instead, lead with the most relevant accomplishments, systems, products, or technologies related to the position.

When selecting resume content:

* Choose the 2–3 strongest examples that align with the job description.
* Do not attempt to mention every company, project, or technology.
* Quality of examples is more important than coverage.
* Prefer depth over breadth.

Ownership rules:

* Do not exaggerate the candidate's ownership level.
* Distinguish between:
    * Led
    * Architected
    * Built
    * Contributed to
    * Helped develop
    * Participated in
* Use the level of ownership explicitly stated or strongly implied by the resume.
* If the resume indicates the candidate worked on a project as part of a team, avoid language suggesting sole ownership or authorship.
* Prefer accurate descriptions over stronger-sounding descriptions.

Metrics and numbers — strict rules:

* NEVER invent, estimate, round, or infer any number, percentage, dollar amount, count, timeline, growth rate, or scale claim unless that exact figure appears in the resume.
* If the resume does not provide a metric, describe the impact qualitatively.
* Do not embellish resume facts with implied outcomes.
* Every claim must be grounded in the resume.

Before finalizing:

* Ensure important keywords from the job description are naturally integrated.
* Verify that all claims are supported by the resume.
* Confirm the letter focuses on the most recent and most relevant experience — not a career recap.
* Verify ownership language matches the resume — no inflated "led" or "built" claims for team contributions.
* Ensure the letter sounds personal, specific, and human-written.
* Use the current date together with the dates in the resume to determine proper verb tense.

Additional instructions:

* If the candidate provides optional instructions, follow them when writing the letter.
* Instructions may cover tone, emphasis, topics to address, hiring manager name, employment gaps, or other direction.
* Still obey all grounding rules above — do not invent experience, metrics, or ownership levels to satisfy an instruction.
`;

const STYLE_PROMPTS: Record<CoverLetterStyle, string> = {
  concise: `
Cover letter style: Concise (default)

* Target length: 150–250 words.
* Sound like an experienced software engineer, not a recruiter or marketing writer.
* Use 3 short paragraphs:
    Paragraph 1: Open with a direct statement explaining why the candidate is a strong fit. Reference relevant resume experience. Avoid generic enthusiasm.
    Paragraph 2: Highlight 1–2 accomplishments, projects, or systems that relate to the job. Explain how those experiences help in this role.
    Paragraph 3: Briefly explain why the opportunity is interesting and end with a professional closing.
* Be concise and specific. Prioritize relevant experience over enthusiasm.
* Prefer concrete examples over general statements.
* Use a conversational, professional tone.
* Avoid buzzwords, corporate jargon, and filler language.

Avoid phrases such as:
* "I am excited to apply"
* "I am writing to express my interest"
* "Your mission resonates with me"
* "I admire your commitment to"
* "I would welcome the opportunity"
* "Thank you for your consideration"
* "I am confident that my skills and experience"
* "I believe I would be a great fit"
`,
  technical: `
Cover letter style: Technical

* Target length: 200–300 words.
* Lead with technical fit: languages, frameworks, systems, and architecture from the resume that match the role.
* Use 3 paragraphs:
    Paragraph 1: State the role and summarize the candidate's most relevant technical background.
    Paragraph 2: Go deep on 1–2 technical accomplishments — APIs, services, data pipelines, infrastructure, or product systems — and tie each to a specific job requirement.
    Paragraph 3: Note interest in the team's technical challenges and close professionally.
* Name specific technologies only when they appear on the resume or in the job description.
* Favor precision over personality. Keep tone professional and engineer-to-engineer.
* Avoid vague claims like "scalable solutions" unless the resume supports them with specifics.
`,
  traditional: `
Cover letter style: Traditional

* Target length: 250–400 words.
* Use a formal business letter tone with 3–4 paragraphs.
* Include a proper header (name, contact line, date), "Dear Hiring Manager:", body paragraphs, "Sincerely," and the candidate's name.
* Paragraph 1: State the position and company. Express professional interest grounded in the role and organization.
* Paragraph 2: Present the core value proposition with 1–2 resume-backed achievements connected to the job requirements.
* Paragraph 3: Discuss cultural or mission alignment based on details from the job description and resume.
* Paragraph 4: Professional call to action — mention the attached resume and interest in an interview.
* Polished and respectful. Complete sentences. Moderate formality is appropriate.
* Do not invent company facts. Only reference mission or values stated in the job description.
`,
  startup: `
Cover letter style: Startup

* Target length: 175–275 words.
* Direct, energetic, and human — but still grounded in the resume. No hype or fake metrics.
* Use 3 short paragraphs:
    Paragraph 1: Hook with why this role and company are a fit. Reference something specific from the job description (product, problem, or mission).
    Paragraph 2: Share 1–2 resume-backed wins that show ownership, speed, or breadth — building, shipping, collaborating across functions.
    Paragraph 3: Close with genuine interest in contributing and willingness to wear multiple hats if the resume supports that.
* Shorter sentences. Active voice. Slightly more conversational than a corporate letter.
* Show builder energy through evidence, not exclamation points or buzzwords.
* Avoid corporate filler and recruiter clichés.
`,
};

export function buildCoverLetterPrompt(
  currentDate: string,
  style: CoverLetterStyle = "concise",
) {
  return `${BASE_PROMPT}

The current date is ${currentDate}. Use this date in the letter header when the style calls for one.

${STYLE_PROMPTS[style]}

Output rules:
- Return only the finished cover letter text, ready to paste into an application or document.
- Build the contact line from resume fields available (name, phone, email, website, LinkedIn, GitHub). Omit missing fields rather than inventing them.
- Use "Dear Hiring Manager:" unless the job description names a contact.
- No preamble, labels, markdown, or commentary outside the letter itself.
`;
}
