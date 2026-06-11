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

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Associated label text, preserving original casing. */
function labelTextFor(el: FillableElement): string | null {
  const parts: string[] = [];

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    for (const id of labelledBy.split(/\s+/)) {
      const text = document.getElementById(id)?.textContent;
      if (text) parts.push(text);
    }
  }

  if (el.id) {
    const explicit = document.querySelector(`label[for="${cssEscape(el.id)}"]`);
    const text = explicit?.textContent;
    if (text) parts.push(text);
  }

  const wrappingLabel = el.closest("label");
  if (wrappingLabel) parts.push(wrappingLabel.textContent ?? "");

  const combined = collapseWhitespace(parts.join(" "));
  return combined.length > 0 ? combined : null;
}

/**
 * Best-effort human-readable prompt for a field, taken from its label, aria
 * label, or placeholder. Used as the question to send to the AI.
 */
export function extractQuestion(el: FillableElement): string | null {
  return (
    labelTextFor(el) ||
    collapseWhitespace(el.getAttribute("aria-label") ?? "") ||
    collapseWhitespace(el.getAttribute("placeholder") ?? "") ||
    null
  );
}
