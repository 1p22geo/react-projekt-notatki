import { useState } from "react";
import "./App.css";
import NoteCard from "./components/NoteCard/NoteCard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import type { Note } from "./models/note";

const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Project Ideas",
    content: "Building a note-taking app for Bodzio Meble. Need to focus on UX and clean design.",
    createdAt: "2024-03-20",
  },
  {
    id: "2",
    title: "Grocery List",
    content: "Milk, eggs, bread, and some fresh vegetables from the market.",
    createdAt: "2024-03-19",
  },
  {
    id: "3",
    title: "Meeting Notes",
    content: "Discuss the new furniture line with the design team. Focus on ergonomic chairs.",
    createdAt: "2024-03-18",
  },
];

function App() {
  const [selectedNote, setSelectedNote] = useState<Note>(MOCK_NOTES[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar notes={MOCK_NOTES} onNoteSelect={setSelectedNote} selectedNoteId={selectedNote.id} />
        <main className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 px-4 border-l-4 border-blue-600 ml-2">Note Details</h3>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <NoteCard note={selectedNote} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
