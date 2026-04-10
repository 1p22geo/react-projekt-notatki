import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Link as LinkIcon, Hash, ExternalLink, StickyNote, MapPin } from "lucide-react";
import type { Note, NoteType } from "../models/note";

interface BottomPanelProps {
  currentNote: Note;
  allNotes: Note[];
  onNoteNavigate: (title: string) => void;
  onUpdateType: (id: string, type: NoteType) => void;
}

export default function BottomPanel({ currentNote, allNotes, onNoteNavigate, onUpdateType }: BottomPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"links" | "backlinks" | "settings">("links");

  // Robust link extraction logic
  const extractLinks = (content: string) => {
    if (!content) return [];
    const foundLinks = new Set<{ title: string; isExternal: boolean; url: string }>();
    
    const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdRegex.exec(content)) !== null) {
      const title = match[1].trim();
      const url = match[2].trim();
      const isExternal = url !== "#" && url.startsWith("http");
      foundLinks.add({ title, isExternal, url });
    }

    const wikiRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    while ((match = wikiRegex.exec(content)) !== null) {
      foundLinks.add({ title: match[1].trim(), isExternal: false, url: "#" });
    }
    
    return Array.from(foundLinks);
  };

  const allExtractedLinks = useMemo(() => extractLinks(currentNote.content), [currentNote.content]);
  const links = allExtractedLinks;
  
  const backlinks = useMemo(() => {
    return allNotes.filter(note => {
      if (note.id === currentNote.id) return false;
      const noteLinks = extractLinks(note.content);
      return noteLinks.some(link => 
        !link.isExternal && link.title.toLowerCase() === currentNote.title.toLowerCase()
      );
    });
  }, [allNotes, currentNote.id, currentNote.title]);

  return (
    <div 
      className={`fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 transition-all duration-300 z-20 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] ${
        isOpen ? "h-64" : "h-12"
      }`}
    >
      <div 
        className="h-12 px-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-b border-transparent group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-500 group-hover:text-blue-600 transition-colors">
            {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            <span className="text-sm font-bold uppercase tracking-widest">Document Analysis</span>
          </div>
          
          {isOpen && (
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab("links"); }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === "links" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Links ({links.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab("backlinks"); }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === "backlinks" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Backlinks ({backlinks.length})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab("settings"); }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === "settings" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Settings
              </button>
            </div>
          )}
        </div>
        
        {!isOpen && (
          <div className="flex items-center space-x-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{links.length} Links</span>
            <span>•</span>
            <span>{backlinks.length} Backlinks</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="capitalize">{currentNote.type}</span>
            </span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="h-52 overflow-y-auto p-6 bg-gray-50/50">
          {activeTab === "links" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {links.length > 0 ? links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => link.isExternal ? window.open(link.url, "_blank") : onNoteNavigate(link.title)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group text-left"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`p-1.5 rounded-lg ${link.isExternal ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                      <LinkIcon size={14} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 truncate">{link.title}</span>
                  </div>
                  <ExternalLink size={12} className={`text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all ${link.isExternal ? "opacity-100! text-emerald-300!" : ""}`} />
                </button>
              )) : (
                <div className="col-span-full py-8 text-center text-gray-400 italic text-sm">No internal links.</div>
              )}
            </div>
          ) : activeTab === "backlinks" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {backlinks.length > 0 ? backlinks.map((note) => (
                <button
                  key={note.id}
                  onClick={() => onNoteNavigate(note.title)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group text-left"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Hash size={14} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 truncate">{note.title}</span>
                  </div>
                  <ExternalLink size={12} className="text-gray-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              )) : (
                <div className="col-span-full py-8 text-center text-gray-400 italic text-sm">No backlinks.</div>
              )}
            </div>
          ) : (
            <div className="max-w-md space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest px-1">Document Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onUpdateType(currentNote.id, "note")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    currentNote.type === "note" ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100 shadow-sm" : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <StickyNote size={24} className={currentNote.type === "note" ? "text-blue-600" : "text-gray-400"} />
                  <span className={`text-xs font-bold mt-2 ${currentNote.type === "note" ? "text-blue-700" : "text-gray-500"}`}>Regular Document</span>
                </button>
                <button
                  onClick={() => onUpdateType(currentNote.id, "place")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    currentNote.type === "place" ? "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100 shadow-sm" : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <MapPin size={24} className={currentNote.type === "place" ? "text-emerald-600" : "text-gray-400"} />
                  <span className={`text-xs font-bold mt-2 ${currentNote.type === "place" ? "text-emerald-700" : "text-gray-500"}`}>Geographic Place</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
