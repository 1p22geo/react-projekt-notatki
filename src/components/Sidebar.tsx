import { Trash2, Plus, Layout, Map as MapIcon, StickyNote } from "lucide-react";
import type { Note } from "../models/note";

export type SidebarView = "list" | "map";

interface SidebarProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  selectedNoteId?: string;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
}

export default function Sidebar({ 
  notes, 
  onNoteSelect, 
  selectedNoteId, 
  onAddNote, 
  onDeleteNote,
  activeView,
  onViewChange
}: SidebarProps) {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 flex flex-col space-y-6">
      <div className="flex flex-col space-y-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeView === "list" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Layout size={18} />
          <span>Documents</span>
        </button>
        <button
          onClick={() => onViewChange("map")}
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeView === "map" ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <MapIcon size={18} />
          <span>Atlas</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Your Workspace</h2>
        <div className="flex flex-col space-y-1">
          {notes.map((note) => (
            <div key={note.id} className="relative group">
              <button
                onClick={() => onNoteSelect(note)}
                className={`w-full flex items-center space-x-3 text-left px-4 py-3 rounded-xl transition-all ${
                  selectedNoteId === note.id
                    ? "bg-white shadow-md border-gray-100 ring-1 ring-black/5"
                    : "hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  note.type === 'place' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {note.type === 'place' ? <MapIcon size={14} /> : <StickyNote size={14} />}
                </div>
                <div className="flex flex-col truncate pr-6">
                  <span
                    className={`text-sm font-semibold truncate ${
                      selectedNoteId === note.id ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {note.title || "Untitled"}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{note.type}</span>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="absolute top-4 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Delete note"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
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
