import React, { useCallback, useEffect, useState } from "react";
import TopNav from "./components/TopNav";
import NotesSidebar from "./components/NotesSidebar";
import NoteEditor from "./components/NoteEditor";
import {
  loadNotes,
  saveNotes,
  generateId,
  deriveTitle
} from "./utils/storage.js";

const initialLayout = {
  sidebarWidth: 270
};

/**
 * The main application shell for Local Note Keeper.
 * Handles storage, listing, CRUD, and selection logic.
 */
// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  // Load initial notes only once
  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  // Find the currently selected note
  const selectedNote = notes.find(n => n.id === selectedId) || null;
  const isNewNote =
    (selectedNote && !notes.some(n => n.id === selectedId)) || false;

  // Persist to localStorage whenever notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Ctrl+S for save at app/document level (if editor is visible)
  useEffect(() => {
    function handleShortcuts(e) {
      // Already handled at component level but prevent browser fallback
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
      }
      // Esc clears selection if not in input
      if (
        e.key === "Escape" &&
        document.activeElement &&
        (document.activeElement.tagName !== "TEXTAREA" &&
          document.activeElement.tagName !== "INPUT")
      ) {
        setSelectedId(null);
      }
    }
    document.addEventListener("keydown", handleShortcuts);
    return () => document.removeEventListener("keydown", handleShortcuts);
  }, []);

  // Add new note
  const handleNewNote = useCallback(() => {
    const newNote = {
      id: generateId(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  }, []);

  // Delete note
  const handleDeleteNote = useCallback(
    (id) => {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  // Save/update note content
  const handleEditNote = useCallback((edited) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === edited.id);
      if (exists) {
        return prev.map(n => (n.id === edited.id ? { ...edited } : n));
      }
      return [edited, ...prev];
    });
  }, []);

  // Explicit save action (may do nothing, required for Editor)
  const handleSave = useCallback(() => true, []);

  // Sidebar select
  const onSelect = useCallback((id) => setSelectedId(id), []);

  // Reorder by most recently updated on any note update
  const orderedNotes = React.useMemo(() => {
    return [...notes]
      .sort(
        (a, b) =>
          (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
      );
  }, [notes]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--text)"
      }}
    >
      <TopNav />
      <main style={{ display: "flex", flex: 1, minHeight: 0, background: "#f7fbff" }}>
        <NotesSidebar
          notes={orderedNotes}
          selectedId={selectedId}
          onSelect={onSelect}
          onNew={handleNewNote}
          onDelete={handleDeleteNote}
          search={search}
          setSearch={setSearch}
        />
        <div style={{ flex: 1, minWidth: 0, background: "#f8fafc" }}>
          <NoteEditor
            note={selectedNote}
            onChange={handleEditNote}
            onSave={handleSave}
            onDelete={() => selectedId && handleDeleteNote(selectedId)}
            isNewNote={false}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
