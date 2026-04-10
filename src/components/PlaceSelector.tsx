import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import type { Location } from "../models/note";

// Fix for default marker icons in Leaflet with Vite/React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PlaceSelectorProps {
  location?: Location;
  onChange: (location: Location) => void;
}

function MapEvents({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function PlaceSelector({ location, onChange }: PlaceSelectorProps) {
  const [points, setPoints] = useState<[number, number][]>(location?.polygon || []);
  const center: [number, number] = location ? [location.lat, location.lng] : [52.2297, 21.0122]; // Warsaw default

  const handleMapClick = (latlng: L.LatLng) => {
    const newPoint: [number, number] = [latlng.lat, latlng.lng];
    const newPoints = [...points, newPoint];
    setPoints(newPoints);
    onChange({
      lat: latlng.lat,
      lng: latlng.lng,
      polygon: newPoints.length > 2 ? newPoints : undefined
    });
  };

  const clearPoints = () => {
    setPoints([]);
    if (location) {
        onChange({ ...location, polygon: undefined });
    }
  };

  return (
    <div className="relative w-full h-80 mb-8 rounded-3xl overflow-hidden border border-gray-200 shadow-inner group">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onClick={handleMapClick} />
        {location && <Marker position={[location.lat, location.lng]} />}
        {points.length > 2 && <Polygon positions={points} color="rgb(37, 99, 235)" fillOpacity={0.2} />}
      </MapContainer>
      
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.preventDefault(); clearPoints(); }}
          className="bg-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border border-red-100"
        >
          Clear Shape
        </button>
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg text-[10px] font-bold text-gray-500 border border-gray-100 uppercase tracking-widest">
          Click to place points
        </div>
      </div>
    </div>
  );
}
