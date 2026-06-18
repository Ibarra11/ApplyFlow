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

Ownership rules (strict):

* Do not exaggerate the candidate's ownership level. Prefer accurate descriptions over stronger-sounding ones.
* Default assumption: work at an employer on a named product, platform, or initiative was a team effort unless the resume explicitly claims sole ownership (e.g. "sole developer", "built end-to-end independently", "founding engineer who shipped v1 alone").
* Match cover letter verbs to the resume's wording:
    * Resume says "led" / "owned" / "architected" → you may use led, owned, or architected.
    * Resume says "built", "developed", or "implemented" without sole-ownership cues → use contributed to, worked on, helped build, or helped implement.
    * Resume says "collaborated", "supported", or lists work among team bullets → use contributed to, supported, or helped improve.
* Never upgrade team work into solo authorship. Do not write as if the candidate single-handedly created a company product unless the resume clearly supports that.
* When describing employer products or platforms, name the work and tie it to the job; do not imply the candidate launched the entire product unless the resume says so.
* Scope individual contributions clearly when the resume lists specific tasks (e.g. analytics pipelines, operational controls, validation automation) rather than collapsing them into "I built and launched [product name]".
* Distinguish between:
    * Led / owned / architected (only when resume supports it)
    * Contributed to / worked on / helped develop (default for employer product work)
    * Participated in / supported (for collaborative or supporting work)
* Avoid inflated solo-ownership phrasing such as:
    * "I successfully built and launched"
    * "I built and launched [product]" (when resume only shows contributing bullets)
    * "I created [company product]" without resume support
    * "I developed [entire platform/system]" when resume describes specific components
* Prefer collaborative phrasing such as "contributed to", "worked on", "helped implement", "as part of the team that", or "my work included".

Metrics, tenure, and numbers, strict rules:

* NEVER invent, estimate, round, or infer any number, percentage, dollar amount, count, timeline, growth rate, scale claim, or years-of-experience claim unless that exact figure appears in the resume.
* NEVER state, estimate, or imply total years of experience (e.g. "over four years", "5+ years", "a decade of experience") unless the resume explicitly states that exact figure.
* Do not calculate total career length by adding up employment date ranges.
* Do not open the letter with a tenure summary or career-length claim. Open with a specific role, company, project, or accomplishment from the resume instead.
* You may mention how long the candidate held a specific role only when both start and end dates for that role appear on the resume (e.g. "At Playback Rewards from 2022 to 2024, I...").
* If the resume does not provide a metric or duration, describe the impact qualitatively.
* Do not embellish resume facts with implied outcomes.
* Every claim must be grounded in the resume.

Before finalizing:

* Ensure important keywords from the job description are naturally integrated.
* Verify that all claims are supported by the resume.
* Confirm the letter focuses on the most recent and most relevant experience, not a career recap.
* Re-read every accomplishment for ownership inflation. If a sentence could read as "I did this entire product myself", rewrite it to reflect team context and the candidate's specific contribution from the resume.
* Verify ownership language matches the resume. Do not inflate "led" or "built" claims for team contributions.
* Verify the letter contains no invented years-of-experience or total-tenure claims.
* Ensure the letter sounds personal, specific, and human-written.
* Use the current date together with the dates in the resume to determine proper verb tense.

Additional instructions:

* If the candidate provides optional instructions, follow them when writing the letter.
* Instructions may cover tone, emphasis, topics to address, hiring manager name, employment gaps, or other direction.
* Still obey all grounding rules above. Do not invent experience, metrics, or ownership levels to satisfy an instruction.
`;

const STYLE_PROMPTS: Record<CoverLetterStyle, string> = {
  concise: `
Cover letter style: Concise (default)

* Target length: 150–250 words.
* Sound like an experienced software engineer, not a recruiter or marketing writer.
* Use 3 short paragraphs:
    Paragraph 1: Open with a direct statement explaining why the candidate is a strong fit. Lead with a specific role, company, or accomplishment from the resume. Do not open with total years of experience or a career-length summary. Avoid generic enthusiasm.
    Paragraph 2: Highlight 1–2 accomplishments, projects, or systems that relate to the job. Explain how those experiences help in this role.
    Paragraph 3: Briefly explain why the opportunity is interesting and end with a professional closing.
* Be concise and specific. Prioritize relevant experience over enthusiasm.
* Prefer concrete examples over general statements.
* Use a conversational, professional tone.
* Avoid buzzwords, corporate jargon, and filler language.

Avoid phrases such as:
* "I am excited to apply"
* "I am eager to apply"
* "With over X years of experience"
* "X years of experience in"
* "I am writing to express my interest"
* "Your mission resonates with me"
* "I admire your commitment to"
* "I would welcome the opportunity"
* "Thank you for your consideration"
* "I am confident that my skills and experience"
* "I believe I would be a great fit"
* "make me a valuable addition"
* "solid track record of"
* "I successfully built and launched"
* "I built and launched" (unless the resume explicitly supports sole ownership of that product)
* "I created" or "I developed" for a named employer product when resume bullets describe team contributions
`,
  technical: `
Cover letter style: Technical

* Target length: 200–300 words.
* Lead with technical fit: languages, frameworks, systems, and architecture from the resume that match the role.
* Use 3 paragraphs:
    Paragraph 1: State the role and summarize the candidate's most relevant technical background.
    Paragraph 2: Go deep on 1–2 technical accomplishments (APIs, services, data pipelines, infrastructure, or product systems) and tie each to a specific job requirement.
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
* Paragraph 4: Professional call to action. Mention the attached resume and interest in an interview.
* Polished and respectful. Complete sentences. Moderate formality is appropriate.
* Do not invent company facts. Only reference mission or values stated in the job description.
`,
  startup: `
Cover letter style: Startup

* Target length: 175–275 words.
* Direct, energetic, and human, but still grounded in the resume. No hype or fake metrics.
* Use 3 short paragraphs:
    Paragraph 1: Hook with why this role and company are a fit. Reference something specific from the job description (product, problem, or mission).
    Paragraph 2: Share 1–2 resume-backed wins that show impact, speed, or breadth: contributing, shipping, collaborating across functions. Use ownership language only when the resume supports it.
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
- Do not use em dashes (—). Use commas, periods, colons, or parentheses instead.
- Do not state total years of experience or career tenure unless the resume explicitly includes that exact figure.
- Do not describe employer products or platforms as if the candidate built or launched them alone unless the resume explicitly supports sole ownership.
- No preamble, labels, markdown, or commentary outside the letter itself.
`;
}
