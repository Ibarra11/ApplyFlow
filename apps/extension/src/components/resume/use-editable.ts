import { useState } from "react";

export function useEditable<T>(value: T, onSave: (draft: T) => void) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<T>(value);
  const [synced, setSynced] = useState<T>(value);

  if (!editing && value !== synced) {
    setSynced(value);
    setDraft(value);
  }

  return {
    editing,
    draft,
    setDraft,
    start: () => {
      setDraft(value);
      setEditing(true);
    },
    cancel: () => {
      setDraft(value);
      setEditing(false);
    },
    save: () => {
      onSave(draft);
      setEditing(false);
    },
  };
}
