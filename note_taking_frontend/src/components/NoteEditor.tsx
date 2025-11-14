import React, { useEffect, useRef, useState } from "react";
import { Note } from "../types";

// If you don't want to use a markdown library, add a simple renderer.
function basicMarkdown(text: string): string {
  // Bold **text**
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
  return html;
}

interface NoteEditorProps {
  note: Note | null;
  onChange: (note: Note) => void;
  onSave: () => boolean;
  onDelete: () => void;
  isNewNote: boolean;
}

const defaultNoteState = {
  title: "",
  content: ""
};

/**
 * Main note editor pane; shows title, content, and actions.
 */
// PUBLIC_INTERFACE
const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onChange,
  onSave,
  onDelete,
  isNewNote
}) => {
  const [edit, setEdit] = useState(defaultNoteState);
  const [showPreview, setShowPreview] = useState(false);
  const [dirty, setDirty] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  // Populate state with loaded note
  useEffect(() => {
    setEdit(
      note
        ? { title: note.title, content: note.content }
        : defaultNoteState
    );
    setDirty(false);
    if (note && titleRef.current) titleRef.current.focus();
  }, [note?.id]);

  // Save on Ctrl+S/Cmd+S, cancel on ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!dirty) return;
        onChange({
          ...note!,
          ...edit,
          updatedAt: Date.now()
        });
        onSave();
        setDirty(false);
      }
      if (e.key === "Escape") {
        // optionally, blur or inform parent to clear selection
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [edit, note, dirty]);

  function handleField(
    field: "title" | "content",
    value: string
  ) {
    setEdit((cur) => {
      return { ...cur, [field]: value };
    });
    setDirty(true);
  }

  if (!note) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#64748b"
        }}
      >
        <div style={{ fontSize: 22, marginBottom: 8 }}>
          Select a note or create one.
        </div>
        <div style={{fontSize: 15}}>Your notes are stored only in this browser.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        background: "#f7fbff",
        minHeight: 0,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <form
        style={{
          width: "100%",
          maxWidth: 760,
          margin: "32px auto",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 1px 9px #c7e4fc17",
          padding: "28px 34px 21px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minHeight: 320,
        }}
        onSubmit={e => {
          e.preventDefault();
          if (!dirty) return;
          onChange({
            ...note,
            ...edit,
            updatedAt: Date.now()
          });
          onSave();
          setDirty(false);
        }}
      >
        <input
          ref={titleRef}
          placeholder="Title (optional)"
          value={edit.title}
          onChange={e => handleField("title", e.target.value)}
          maxLength={120}
          style={{
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 3,
            background: "#f5f8fc"
          }}
          data-testid="note-title"
        />
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
          <button
            className="btn"
            type="button"
            style={{background: "var(--success)"}}
            onClick={() => setShowPreview(p => !p)}
            tabIndex={0}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <span style={{flex: 1}} />
          <button
            className="btn"
            type="submit"
            style={{background: "var(--primary)"}}
            disabled={!dirty}
            aria-label="Save"
          >
            Save
            <span style={{marginLeft: 6, fontSize: 13, color: "#e0eafc"}}>
              (Ctrl+S)
            </span>
          </button>
          {!isNewNote && (
            <button
              className="btn secondary"
              type="button"
              aria-label="Delete"
              style={{background: "var(--error)", marginLeft: 8}}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
        {showPreview ? (
          <div
            style={{
              minHeight: 190,
              fontFamily: "inherit",
              padding: "12px",
              background: "#f1f5f9",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              color: "#13203f"
            }}
            dangerouslySetInnerHTML={{ __html: basicMarkdown(edit.content) }}
          />
        ) : (
          <textarea
            value={edit.content}
            onChange={e => handleField("content", e.target.value)}
            style={{
              minHeight: 190,
              fontSize: 15,
              fontFamily: "inherit",
              background: "#f8fafc",
              resize: "vertical"
            }}
            placeholder="Start writing in Markdown or plain text..."
            data-testid="note-content"
          />
        )}
      </form>
    </div>
  );
};

export default NoteEditor;
