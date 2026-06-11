import type { Suggestion } from "./suggestions";

export type DropdownAction = {
  label: string;
  onRun: () => void;
};

const STYLE = `
:host { all: initial; }
.af-panel {
  position: fixed;
  z-index: 2147483647;
  box-sizing: border-box;
  min-width: 220px;
  max-width: 420px;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #111827;
}
.af-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #6b7280;
}
.af-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 500;
  color: #2563eb;
}
.af-action:hover,
.af-action.af-active {
  background: #eff6ff;
}
.af-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 2px 6px;
}
.af-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 7px;
  cursor: pointer;
}
.af-item:hover,
.af-item.af-active {
  background: #f3f4f6;
}
.af-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.af-value {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.af-label {
  flex: none;
  font-size: 11px;
  color: #6b7280;
}
.af-badge {
  flex: none;
  font-size: 10px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 4px;
  padding: 1px 5px;
}
.af-busy {
  padding: 12px 10px;
  text-align: center;
  color: #6b7280;
  font-size: 12px;
}
.af-error {
  padding: 10px;
  color: #dc2626;
  font-size: 12px;
}
.af-footer {
  padding: 5px 10px 4px;
  font-size: 10px;
  color: #9ca3af;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 2px;
}
`;

export class SuggestionDropdown {
  private host: HTMLDivElement;
  private root: ShadowRoot;
  private panel: HTMLDivElement;
  private items: Suggestion[] = [];
  private action: DropdownAction | null = null;
  private busyMessage: string | null = null;
  private errorMessage: string | null = null;
  private activeIndex = 0;
  private onPick: ((s: Suggestion) => void) | null = null;
  private anchor: HTMLElement | null = null;

  constructor() {
    this.host = document.createElement("div");
    this.host.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:0;";
    this.root = this.host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = STYLE;
    this.root.appendChild(style);

    this.panel = document.createElement("div");
    this.panel.className = "af-panel";
    this.panel.style.display = "none";
    this.root.appendChild(this.panel);

    document.documentElement.appendChild(this.host);

    // Keep clicks inside the panel from blurring the focused input first.
    this.panel.addEventListener("mousedown", (e) => e.preventDefault());
  }

  get isOpen(): boolean {
    return this.panel.style.display !== "none";
  }

  open(
    items: Suggestion[],
    anchor: HTMLElement,
    onPick: (s: Suggestion) => void,
    action?: DropdownAction | null,
  ): void {
    this.items = items;
    this.anchor = anchor;
    this.onPick = onPick;
    this.action = action ?? null;
    this.busyMessage = null;
    this.errorMessage = null;
    this.activeIndex = this.action && items.length > 0 ? 1 : 0;
    this.render();
    this.panel.style.display = "block";
    this.position();
  }

  update(items: Suggestion[]): void {
    if (!this.isOpen || this.busyMessage) return;
    this.items = items;
    if (items.length === 0 && !this.action) {
      this.close();
      return;
    }
    this.activeIndex = Math.min(this.activeIndex, this.rowCount() - 1);
    this.render();
    this.position();
  }

  close(): void {
    this.panel.style.display = "none";
    this.items = [];
    this.action = null;
    this.busyMessage = null;
    this.errorMessage = null;
    this.anchor = null;
    this.onPick = null;
  }

  setBusy(message: string | null): void {
    this.busyMessage = message;
    this.errorMessage = null;
    if (this.isOpen) {
      this.render();
      this.position();
    }
  }

  setError(message: string | null): void {
    this.busyMessage = null;
    this.errorMessage = message;
    if (this.isOpen) {
      this.render();
      this.position();
    }
  }

  move(delta: number): void {
    if (!this.isOpen || this.busyMessage || this.errorMessage) return;
    const count = this.rowCount();
    if (count === 0) return;
    this.activeIndex = (this.activeIndex + delta + count) % count;
    this.render();
  }

  confirmActive(): boolean {
    if (!this.isOpen || this.busyMessage || this.errorMessage) return false;

    if (this.action && this.activeIndex === 0) {
      this.action.onRun();
      return true;
    }

    const itemIndex = this.action ? this.activeIndex - 1 : this.activeIndex;
    const item = this.items[itemIndex];
    if (item && this.onPick) {
      this.onPick(item);
      this.close();
      return true;
    }
    return false;
  }

  position(): void {
    if (!this.anchor || !this.isOpen) return;
    const rect = this.anchor.getBoundingClientRect();
    const gap = 4;
    const viewportH = window.innerHeight;
    this.panel.style.minWidth = `${Math.max(rect.width, 220)}px`;

    // Default below; flip above when there isn't enough room.
    const panelHeight = this.panel.offsetHeight;
    const below = viewportH - rect.bottom;
    if (below < panelHeight + gap && rect.top > below) {
      this.panel.style.top = `${Math.max(rect.top - panelHeight - gap, 4)}px`;
    } else {
      this.panel.style.top = `${rect.bottom + gap}px`;
    }
    this.panel.style.left = `${Math.max(rect.left, 4)}px`;
  }

  private rowCount(): number {
    return (this.action ? 1 : 0) + this.items.length;
  }

  private render(): void {
    this.panel.replaceChildren();

    const header = document.createElement("div");
    header.className = "af-header";
    header.textContent = "ApplyFlow suggestions";
    this.panel.appendChild(header);

    if (this.busyMessage) {
      const busy = document.createElement("div");
      busy.className = "af-busy";
      busy.textContent = this.busyMessage;
      this.panel.appendChild(busy);
      return;
    }

    if (this.errorMessage) {
      const error = document.createElement("div");
      error.className = "af-error";
      error.textContent = this.errorMessage;
      this.panel.appendChild(error);
      return;
    }

    if (this.action) {
      const actionEl = document.createElement("div");
      actionEl.className =
        "af-action" + (this.activeIndex === 0 ? " af-active" : "");
      actionEl.textContent = this.action.label;
      actionEl.addEventListener("mouseenter", () => {
        this.activeIndex = 0;
        this.render();
      });
      actionEl.addEventListener("click", () => {
        this.action?.onRun();
      });
      this.panel.appendChild(actionEl);

      if (this.items.length > 0) {
        const divider = document.createElement("div");
        divider.className = "af-divider";
        this.panel.appendChild(divider);
      }
    }

    this.items.forEach((item, index) => {
      const rowIndex = this.action ? index + 1 : index;
      const el = document.createElement("div");
      el.className =
        "af-item" + (rowIndex === this.activeIndex ? " af-active" : "");

      const top = document.createElement("div");
      top.className = "af-item-top";

      const value = document.createElement("span");
      value.className = "af-value";
      value.textContent = item.value;
      top.appendChild(value);

      if (index === 0) {
        const badge = document.createElement("span");
        badge.className = "af-badge";
        badge.textContent = "Recommended";
        top.appendChild(badge);
      }
      el.appendChild(top);

      const label = document.createElement("span");
      label.className = "af-label";
      label.textContent = item.label;
      el.appendChild(label);

      el.addEventListener("mouseenter", () => {
        this.activeIndex = rowIndex;
        this.render();
      });
      el.addEventListener("click", () => {
        this.onPick?.(item);
        this.close();
      });

      this.panel.appendChild(el);
    });

    const footer = document.createElement("div");
    footer.className = "af-footer";
    footer.textContent = "↑↓ navigate · Enter to fill · Esc to dismiss";
    this.panel.appendChild(footer);
  }
}
