import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar, { type SidebarView } from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import BottomPanel from "./components/BottomPanel";
import MainMap from "./components/MainMap";
import type { Note, NoteType } from "./models/note";

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "ZSTI Gliwice",
    content:
      "## Nasza piękna szkoła\n\nkiedyś napisałem review szkoły na Google Maps i następnego dnia zauważyła go pani Gruszka, więc napiszę go tutaj. Albo lepiej nie",
    createdAt: new Date().toISOString().split("T")[0],
    type: "place",
    location: {
      lat: 50.29880132375975,
      lng: 18.69491904973984,
      polygon: [
        [50.298503199582385, 18.695868551731113],
        [50.298194793294876, 18.694291412830356],
        [50.29900692555211, 18.694076836109165],
        [50.29932903324015, 18.695257008075718],
      ],
    },
  },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("nova-notes");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes[0]?.id || null,
  );
  const [activeView, setActiveView] = useState<SidebarView>("list");

  useEffect(() => {
    localStorage.setItem("nova-notes", JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleAddNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
      type: "note",
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setActiveView("list");
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(newNotes[0]?.id || null);
      }
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const handleUpdateNoteType = (id: string, type: NoteType) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, type } : n)));
  };

  const handleNoteNavigate = (title: string) => {
    const targetNote = notes.find(
      (n) => n.title.toLowerCase() === title.toLowerCase(),
    );
    if (targetNote) {
      setSelectedNoteId(targetNote.id);
      setActiveView("list");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          notes={notes}
          onNoteSelect={(note) => {
            setSelectedNoteId(note.id);
            setActiveView("list");
          }}
          selectedNoteId={selectedNoteId || undefined}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 overflow-y-auto relative">
          {activeView === "map" ? (
            <MainMap notes={notes} onNoteNavigate={handleNoteNavigate} />
          ) : selectedNote ? (
            <div className="pb-12">
              <NoteEditor
                note={selectedNote}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                onNoteNavigate={handleNoteNavigate}
              />
              <BottomPanel
                currentNote={selectedNote}
                allNotes={notes}
                onNoteNavigate={handleNoteNavigate}
                onUpdateType={handleUpdateNoteType}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-6">
              <div className="p-10 rounded-[2.5rem] bg-gray-50 mb-4 animate-in zoom-in duration-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900 tracking-tight">
                  Select a document
                </p>
                <p className="text-gray-400 mt-2">
                  or create a new one to get started
                </p>
              </div>
              <button
                onClick={handleAddNote}
                className="mt-6 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Create New Document
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
