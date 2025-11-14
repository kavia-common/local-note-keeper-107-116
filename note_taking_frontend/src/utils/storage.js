/* Storage key for persisted notes */
const STORAGE_KEY = "lnk_notes_v1";

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (err) {
    // Quota exceeded or other error
    alert(
      "Failed to save note. There may be no more storage space in your browser."
    );
    return false;
  }
}

export function generateId(): string {
  // Simple UUID v4-like (not cryptographically secure)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function deriveTitle(note: Note): string {
  if (note.title && note.title.trim()) return note.title.trim();
  const firstLine =
    note.content.split(/\n/).find(line => !!line.trim())?.trim() ?? "Untitled";
  return firstLine.slice(0, 64);
}
