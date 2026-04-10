export interface Location {
  lat: number;
  lng: number;
  polygon?: [number, number][]; // Array of lat/lng tuples
}

export type NoteType = "note" | "place";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: NoteType;
  location?: Location;
}
