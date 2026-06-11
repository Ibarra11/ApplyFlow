export type FieldKind =
  | "firstname"
  | "lastname"
  | "fullname"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "portfolio"
  | "title"
  | "company"
  | "school"
  | "degree"
  | "location"
  | "skills"
  | "summary";

export type FillableElement = HTMLInputElement | HTMLTextAreaElement;

const FILLABLE_INPUT_TYPES = new Set([
  "text",
  "email",
  "tel",
  "url",
  "search",
  "",
]);

export function isFillableElement(
  el: EventTarget | null,
): el is FillableElement {
  if (el instanceof HTMLTextAreaElement) return !el.disabled && !el.readOnly;
  if (el instanceof HTMLInputElement) {
    const type = el.type.toLowerCase();
    return FILLABLE_INPUT_TYPES.has(type) && !el.disabled && !el.readOnly;
  }
  return false;
}

/**
 * Collects every textual signal that hints at what an input is for: its
 * attributes plus any associated/visible label text.
 */
function signalsFor(el: FillableElement): string {
  debugger;
  const parts: string[] = [
    el.getAttribute("name") ?? "",
    el.id ?? "",
    el.getAttribute("autocomplete") ?? "",
    el.getAttribute("placeholder") ?? "",
    el.getAttribute("aria-label") ?? "",
    el.getAttribute("type") ?? "",
    el.getAttribute("data-test") ?? "",
    el.getAttribute("data-testid") ?? "",
  ];

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    for (const id of labelledBy.split(/\s+/)) {
      parts.push(document.getElementById(id)?.textContent ?? "");
    }
  }

  if (el.id) {
    const explicit = document.querySelector(`label[for="${cssEscape(el.id)}"]`);
    parts.push(explicit?.textContent ?? "");
  }

  const wrappingLabel = el.closest("label");
  if (wrappingLabel) parts.push(wrappingLabel.textContent ?? "");

  return parts.join(" ").toLowerCase();
}

function cssEscape(value: string): string {
  debugger;
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}

type Matcher = {
  /** Kinds to surface, most-recommended first. */
  kinds: FieldKind[];
  test: (signals: string, el: FillableElement) => boolean;
};

/** Ordered most-specific first; the first matching rule wins. */
const MATCHERS: Matcher[] = [
  {
    kinds: ["email"],
    test: (s, el) => {
      debugger;
      return (
        (el instanceof HTMLInputElement && el.type === "email") ||
        /e-?mail/.test(s)
      );
    },
  },
  {
    kinds: ["phone"],
    test: (s, el) =>
      (el instanceof HTMLInputElement && el.type === "tel") ||
      /phone|mobile|\btel\b/.test(s),
  },
  { kinds: ["linkedin"], test: (s) => /linked-?in/.test(s) },
  { kinds: ["github"], test: (s) => /git-?hub/.test(s) },
  {
    kinds: ["portfolio", "linkedin", "github"],
    test: (s, el) =>
      (el instanceof HTMLInputElement && el.type === "url") ||
      /portfolio|personal\s*(site|website)|\bwebsite\b|\bweb\s*site\b|\bsite\b|\burl\b/.test(
        s,
      ),
  },
  {
    kinds: ["firstname"],
    test: (s) => /first[\s_-]*name|given[\s_-]*name|\bfname\b|forename/.test(s),
  },
  {
    kinds: ["lastname"],
    test: (s) => /last[\s_-]*name|surname|family[\s_-]*name|\blname\b/.test(s),
  },
  {
    kinds: ["fullname", "firstname", "lastname"],
    test: (s) => /full[\s_-]*name|your[\s_-]*name|\bname\b/.test(s),
  },
  {
    kinds: ["title"],
    test: (s) =>
      /job[\s_-]*title|current[\s_-]*title|\bposition\b|\brole\b|headline|occupation/.test(
        s,
      ),
  },
  {
    kinds: ["company"],
    test: (s) =>
      /company|employer|organi[sz]ation|workplace|current[\s_-]*employer/.test(
        s,
      ),
  },
  {
    kinds: ["school"],
    test: (s) =>
      /school|university|college|institution|alma[\s_-]*mater/.test(s),
  },
  {
    kinds: ["degree"],
    test: (s) =>
      /degree|qualification|\bmajor\b|field[\s_-]*of[\s_-]*study/.test(s),
  },
  {
    kinds: ["location"],
    test: (s) => /\bcity\b|location|\btown\b|address/.test(s),
  },
  {
    kinds: ["skills"],
    test: (s) => /skills?|technolog(y|ies)|tech[\s_-]*stack|competenc/.test(s),
  },
  {
    kinds: ["summary"],
    test: (s, el) =>
      el instanceof HTMLTextAreaElement &&
      /summary|about|\bbio\b|cover[\s_-]*letter|why\b|tell[\s_-]*us|describe|introduce|message/.test(
        s,
      ),
  },
];

/**
 * Returns the field kinds an input most likely maps to, ordered with the
 * recommended kind first. Empty when nothing recognizable is found.
 */
export function detectFieldKinds(el: FillableElement): FieldKind[] {
  debugger;
  const signals = signalsFor(el);
  for (const matcher of MATCHERS) {
    if (matcher.test(signals, el)) return matcher.kinds;
  }
  return [];
}
