import type { Note } from "../../models/note";

export default function NoteCard({ note }: { note: Note }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-md">
      <header className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{note.title}</h2>
      </header>
      <div className="mb-3">
        <span className="text-sm text-gray-400 font-medium">{note.createdAt}</span>
      </div>
      <p className="text-gray-600 leading-relaxed line-clamp-6">{note.content}</p>
    </div>
  );
}
