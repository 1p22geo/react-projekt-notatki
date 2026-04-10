import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Trash2, Eye, Edit3, Link as LinkIcon, MapPin } from "lucide-react";
import type { Note, Location } from "../models/note";
import PlaceSelector from "./PlaceSelector";

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onNoteNavigate?: (title: string) => void;
}

export default function NoteEditor({ note, onUpdate, onDelete, onNoteNavigate }: NoteEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Pre-process content to handle [[WikiLinks]]
  const processedContent = useMemo(() => {
    return note.content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, title, display) => {
      return `[${display || title}](#)`;
    });
  }, [note.content]);

  // Auto-resize textarea
  useEffect(() => {
    if (mode === "edit" && contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [note.content, mode]);

  const handleLocationChange = (location: Location) => {
    onUpdate(note.id, { location });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10 group/header">
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
            {note.createdAt}
          </span>
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setMode("edit")}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "edit" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
          </div>
          {note.type === "place" && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-wider">
              <MapPin size={14} />
              <span>Place</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 font-semibold text-sm"
          title="Delete document"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>

      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate(note.id, { title: e.target.value })}
        className="w-full text-6xl font-black text-gray-900 border-none outline-none bg-transparent placeholder-gray-100 mb-12 tracking-tight"
        placeholder="Document Title"
        disabled={mode === "preview"}
      />

      {note.type === "place" && (
        <PlaceSelector location={note.location} onChange={handleLocationChange} />
      )}

      {mode === "edit" ? (
        <textarea
          ref={contentRef}
          value={note.content}
          onChange={(e) => onUpdate(note.id, { content: e.target.value })}
          className="w-full text-xl text-gray-700 border-none outline-none bg-transparent placeholder-gray-200 resize-none leading-relaxed pb-32 font-mono"
          placeholder="Start writing with Markdown... (e.g., # Header, **bold**, `code`, [[WikiLink]])"
        />
      ) : (
        <div className="prose prose-xl prose-blue max-w-none pb-32 animate-in fade-in slide-in-from-top-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="rounded-2xl overflow-hidden my-6 shadow-sm border border-gray-100">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded-md text-base font-semibold" {...props}>
                    {children}
                  </code>
                );
              },
              a({ href, children }: { href?: string; children?: React.ReactNode }) {
                const isInternal = !href?.startsWith("http");
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      if (isInternal && onNoteNavigate) {
                        e.preventDefault();
                        onNoteNavigate(String(children));
                      }
                    }}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold decoration-2 underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all cursor-pointer group"
                  >
                    {isInternal && <LinkIcon size={16} className="mr-1 opacity-50 group-hover:opacity-100" />}
                    {children}
                  </a>
                );
              },
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
