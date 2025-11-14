import React, { useState, useMemo } from "react";
import { formatRelativeTime } from "../utils/format.js";
import { deriveTitle } from "../utils/storage.js";

/**
 * Sidebar listing all notes, providing search and new note capabilities.
 * @param props - notes, selection, and handler props.
 */
// PUBLIC_INTERFACE
const NotesSidebar = ({
  notes,
  selectedId,
  onSelect,
  onNew,
  onDelete,
  search,
  setSearch
}) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      n =>
        deriveTitle(n).toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <aside
      style={{
        width: 270,
        minWidth: 210,
        maxWidth: 320,
        borderRight: "1px solid var(--surface-border)",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        boxShadow: "0 0 24px 0 rgba(30,58,138,0.04)"
      }}
    >
      <div style={{ padding: "1em 1em 0.5em 1em", display: "flex", gap: 8 }}>
        <input
          type="text"
          style={{ flex: 1 }}
          placeholder="Search notes"
          value={search}
          aria-label="Search notes"
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn" style={{padding: "0 0.9em"}} onClick={onNew} aria-label="New note">
          ＋
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginTop: 4 }}>
        {filtered.length === 0 && (
          <div style={{ padding: "2em 1em", color: "#64748b", fontSize: 16 }}>
            {notes.length === 0
              ? "No notes yet."
              : "No notes match your search."}
          </div>
        )}
        {filtered.map(note => (
          <div
            key={note.id}
            style={{
              background: selectedId === note.id ? "var(--gradient-1)" : "transparent",
              borderLeft:
                selectedId === note.id
                  ? "4px solid var(--primary)"
                  : "4px solid transparent",
              padding: "0.7em 0.8em 0.7em 1.0em",
              cursor: "pointer",
              borderBottom: "1px solid var(--surface-border)",
              display: "flex",
              alignItems: "center",
              position: "relative",
              borderRadius: selectedId === note.id ? "6px" : "0"
            }}
            tabIndex={0}
            aria-selected={selectedId === note.id}
            onClick={() => onSelect(note.id)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                onSelect(note.id);
              }
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: selectedId === note.id ? "var(--primary)" : "var(--text)",
                  textShadow: selectedId === note.id ? "0 1px 8px #e6f2ff77" : "none"
                }}
              >
                {deriveTitle(note)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}
              >
                {formatRelativeTime(note.updatedAt)}
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                setConfirmDelete(note.id);
              }}
              title="Delete note"
              aria-label="Delete note"
              className="btn secondary"
              style={{
                fontWeight: 700,
                fontSize: 14,
                marginLeft: 10,
                padding: "0 0.7em",
                color: "#fff",
                background: "var(--error)"
              }}
              tabIndex={-1}
            >
              🗑️
            </button>
            {confirmDelete === note.id && (
              <span
                style={{
                  position: "absolute",
                  left: 40,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                  borderRadius: 8,
                  padding: "0.3em 0.8em",
                  fontWeight: 500,
                  zIndex: 2,
                  boxShadow: "0 3px 9px rgba(59,130,246,0.1)"
                }}
                tabIndex={0}
              >
                Delete?
                <button
                  className="btn"
                  style={{
                    background: "var(--error)",
                    marginLeft: 10
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(note.id);
                    setConfirmDelete(null);
                  }}
                  tabIndex={-1}
                >
                  Yes
                </button>
                <button
                  className="btn secondary"
                  style={{ marginLeft: 2, background: "#f3f4f6", color: "#3b82f6" }}
                  onClick={e => {
                    e.stopPropagation();
                    setConfirmDelete(null);
                  }}
                  tabIndex={-1}
                >
                  No
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NotesSidebar;
