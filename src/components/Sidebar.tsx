import { Trash2, Plus } from "lucide-react";
import type { Note } from "../models/note";

interface SidebarProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  selectedNoteId?: string;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
}

export default function Sidebar({ notes, onNoteSelect, selectedNoteId, onAddNote, onDeleteNote }: SidebarProps) {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 flex flex-col space-y-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Recent Notes</h2>
      <div className="flex flex-col space-y-1">
        {notes.map((note) => (
          <div key={note.id} className="relative group">
            <button
              onClick={() => onNoteSelect(note)}
              className={`w-full flex flex-col text-left px-4 py-3 rounded-xl transition-all ${
                selectedNoteId === note.id
                  ? "bg-white shadow-md border-gray-100 ring-1 ring-black/5"
                  : "hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100"
              }`}
            >
              <span
                className={`text-sm font-semibold truncate pr-6 ${
                  selectedNoteId === note.id ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {note.title || "Untitled"}
              </span>
              <span className="text-xs text-gray-400 mt-1 truncate">{note.content}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              title="Delete note"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAddNote}
        className="mt-auto bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={18} />
        <span>Add Note</span>
      </button>
    </aside>
  );
}
