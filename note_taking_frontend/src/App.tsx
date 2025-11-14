import React, { useCallback, useEffect, useState } from "react";
import TopNav from "./components/TopNav";
import NotesSidebar from "./components/NotesSidebar";
import NoteEditor from "./components/NoteEditor";
import BottomPager from "./components/BottomPager";
import { Note } from "./types";
import {
  loadNotes,
  saveNotes,
  generateId,
  deriveTitle
} from "./utils/storage";
import {
  getTotalPages,
  slicePage,
  getPageParam,
  setPageParam,
  loadPageFromStorage,
  savePageToStorage,
} from "./utils/pagination";

const PAGE_SIZE = 10;

// PUBLIC_INTERFACE
/**
 * The main application shell for Local Note Keeper.
 * Handles storage, listing, CRUD, and selection logic.
 */
function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Prefer URL param, fallback to localStorage
    const urlPage = getPageParam();
    if (urlPage > 0) return urlPage;
    return loadPageFromStorage();
  });

  // Whenever the search string changes, auto-reset to page 1
  useEffect(() => {
    setCurrentPage(1);
    setPageParam(1);
    savePageToStorage(1);
  }, [search]);

  // Keep currentPage in sync with URL & localStorage
  useEffect(() => {
    setPageParam(currentPage);
    savePageToStorage(currentPage);
  }, [currentPage]);

  // On browser navigation (back/forward), update page
  useEffect(() => {
    function handlePop() {
      const page = getPageParam();
      setCurrentPage(page);
    }
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);


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
    function handleShortcuts(e: KeyboardEvent) {
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
    const newNote: Note = {
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
    (id: string) => {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  // Save/update note content
  const handleEditNote = useCallback((edited: Note) => {
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
  const onSelect = useCallback((id: string) => setSelectedId(id), []);

  // Reorder by most recently updated on any note update
  const orderedNotes = React.useMemo(() => {
    return [...notes]
      .sort(
        (a, b) =>
          (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
      );
  }, [notes]);

  // Apply search filter if needed
  const filteredNotes = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orderedNotes;
    return orderedNotes.filter(
      n =>
        deriveTitle(n).toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [orderedNotes, search]);

  const totalPages = getTotalPages(filteredNotes.length, PAGE_SIZE);
  // Clamp currentPage if under/overflow
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
    // eslint-disable-next-line
  }, [totalPages]);

  const pagedNotes = React.useMemo(
    () => slicePage(filteredNotes, currentPage, PAGE_SIZE),
    [filteredNotes, currentPage]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--text)",
      }}
    >
      <TopNav />
      <main style={{ display: "flex", flex: 1, minHeight: 0, background: "#f7fbff" }}>
        <NotesSidebar
          notes={pagedNotes}
          selectedId={selectedId}
          onSelect={onSelect}
          onNew={handleNewNote}
          onDelete={handleDeleteNote}
          search={search}
          setSearch={setSearch}
        />
        <div style={{ flex: 1, minWidth: 0, background: "#f8fafc", position: "relative", display: "flex", flexDirection: "column" }}>
          <NoteEditor
            note={selectedNote}
            onChange={handleEditNote}
            onSave={handleSave}
            onDelete={() => selectedId && handleDeleteNote(selectedId)}
            isNewNote={false}
          />
          <BottomPager
            totalItems={filteredNotes.length}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={(pg) => {
              if (pg >= 1 && pg <= totalPages) {
                setCurrentPage(pg);
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
