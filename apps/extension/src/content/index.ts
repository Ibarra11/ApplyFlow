import type { Resume } from "@applyflow/schema";
import { PARSED_RESUME_KEY, storage } from "@/lib/storage";
import { fetchAnswer } from "./answer-question";
import { type DropdownAction, SuggestionDropdown } from "./dropdown";
import {
  extractQuestion,
  isFillableElement,
  type FillableElement,
} from "./field-detector";
import {
  filterSuggestions,
  suggestionsForInput,
  type Suggestion,
} from "./suggestions";

// TEMP: remove when done learning. Pauses on page load if DevTools is open,
// so you land directly in this file and can step through.
debugger;

let resume: Resume | null = null;
const dropdown = new SuggestionDropdown();

let activeField: FillableElement | null = null;
let activeSuggestions: Suggestion[] = [];

async function loadResume(): Promise<void> {
  const stored = await storage.getParsedResume();
  resume = stored?.resume ?? null;
}

/**
 * Writes a value into an input/textarea in a way that frameworks like React
 * notice, by using the native value setter before dispatching events.
 */
function fillField(el: FillableElement, value: string): void {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) {
    setter.call(el, value);
  } else {
    el.value = value;
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.focus();
}

function askAiAction(el: FillableElement): DropdownAction {
  return {
    label: "Ask AI to answer this",
    onRun: () => void runAskAi(el),
  };
}

async function runAskAi(el: FillableElement): Promise<void> {
  if (!resume) return;

  const question = extractQuestion(el);
  if (!question) {
    dropdown.setError("Could not find a question for this field");
    return;
  }

  dropdown.setBusy("Generating answer…");
  try {
    const answer = await fetchAnswer(question, resume);
    fillField(el, answer);
    dropdown.close();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not generate an answer";
    dropdown.setError(message);
  }
}

function openDropdown(el: FillableElement, filtered: Suggestion[]): void {
  dropdown.open(
    filtered,
    el,
    (s) => fillField(el, s.value),
    askAiAction(el),
  );
}

function showFor(el: FillableElement): void {
  if (!resume) return;
  debugger;
  const all = suggestionsForInput(resume);
  if (all.length === 0) {
    activeField = null;
    dropdown.close();
    return;
  }
  activeField = el;
  activeSuggestions = all;
  const filtered = filterSuggestions(all, el.value);
  openDropdown(el, filtered);
}

document.addEventListener(
  "focusin",
  (e) => {
    const target = e.target;
    debugger;
    if (isFillableElement(target)) {
      showFor(target);
    }
  },
  true,
);

document.addEventListener(
  "input",
  (e) => {
    const target = e.target;
    if (target !== activeField || !isFillableElement(target)) return;
    const filtered = filterSuggestions(activeSuggestions, target.value);
    if (dropdown.isOpen) {
      dropdown.update(filtered);
    } else {
      openDropdown(target, filtered);
    }
  },
  true,
);

document.addEventListener(
  "keydown",
  (e) => {
    if (!dropdown.isOpen || e.target !== activeField) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        dropdown.move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        dropdown.move(-1);
        break;
      case "Enter":
        if (dropdown.confirmActive()) e.preventDefault();
        break;
      case "Escape":
        dropdown.close();
        break;
    }
  },
  true,
);

document.addEventListener(
  "focusout",
  (e) => {
    if (e.target === activeField) {
      // Allow click-to-pick (mousedown is prevented in the panel) to run first.
      setTimeout(() => {
        if (document.activeElement !== activeField) {
          activeField = null;
          dropdown.close();
        }
      }, 0);
    }
  },
  true,
);

const reposition = () => dropdown.position();
window.addEventListener("scroll", reposition, true);
window.addEventListener("resize", reposition);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[PARSED_RESUME_KEY]) {
    void loadResume();
  }
});

void loadResume();
