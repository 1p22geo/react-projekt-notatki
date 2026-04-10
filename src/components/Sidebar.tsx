import type { Note } from "../models/note";

interface SidebarProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  selectedNoteId?: string;
}

export default function Sidebar({ notes, onNoteSelect, selectedNoteId }: SidebarProps) {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 flex flex-col space-y-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Recent Notes</h2>
      <div className="flex flex-col space-y-1">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => onNoteSelect(note)}
            className={`flex flex-col text-left px-4 py-3 rounded-xl transition-all group ${
              selectedNoteId === note.id
                ? "bg-white shadow-md border-gray-100 ring-1 ring-black/5"
                : "hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100"
            }`}
          >
            <span
              className={`text-sm font-semibold truncate group-hover:text-blue-600 ${
                selectedNoteId === note.id ? "text-blue-600" : "text-gray-800"
              }`}
            >
              {note.title}
            </span>
            <span className="text-xs text-gray-400 mt-1 truncate">{note.content}</span>
          </button>
        ))}
      </div>
      <button className="mt-auto bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Add Note</span>
      </button>
    </aside>
  );
}
