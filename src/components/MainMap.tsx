import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import type { Note } from "../models/note";

interface MainMapProps {
  notes: Note[];
  onNoteNavigate: (title: string) => void;
}

export default function MainMap({ notes, onNoteNavigate }: MainMapProps) {
  const places = notes.filter((n) => n.type === "place" && n.location);
  const center: [number, number] = [50.29880132375975, 18.69491904973984];

  return (
    <div className="w-full h-full p-8 bg-gray-50 flex animate-in fade-in duration-700">
      <div className="w-full h-full rounded-[3rem] overflow-hidden border border-gray-200 shadow-2xl relative">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {places.map((place) => (
            <div key={place.id}>
              {place.location && (
                <>
                  <Marker position={[place.location.lat, place.location.lng]}>
                    <Popup>
                      <div className="p-2 flex flex-col items-center">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {place.title}
                        </h4>
                        <button
                          onClick={() => onNoteNavigate(place.title)}
                          className="mt-2 px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
                        >
                          View Document
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                  {place.location.polygon && (
                    <Polygon
                      positions={place.location.polygon}
                      color="rgb(37, 99, 235)"
                      fillOpacity={0.1}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </MapContainer>

        <div className="absolute top-8 left-8 z-[1000] p-6 bg-white/90 backdrop-blur-md rounded-[2rem] border border-gray-100 shadow-xl max-w-xs pointer-events-none">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            Knowledge Map
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Click the markers to see the related documents
          </p>
        </div>
      </div>
    </div>
  );
}
