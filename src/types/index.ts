// Common types
export interface BilingualText {
  es: string;
  en: string;
}

// Historia types
export interface HistoriaChapter {
  chapterTitle: BilingualText;
  sections: HistoriaSection[];
}

export interface HistoriaSection {
  id: string;
  title: BilingualText;
  year: number;
  images: HistoriaImage[];
  content: BilingualText;
}

export interface HistoriaImage {
  src: string;
  caption: BilingualText;
}

// Lineup types
export interface LineupFormation {
  id: string;
  period: string;
  yearStart: number;
  yearEnd: number;
  title: BilingualText;
  description: BilingualText;
  members: LineupMember[];
  albums: string[];
  image: string;
}

export interface LineupMember {
  id: string;
  name: string;
  instrument: BilingualText;
  role: string; // founder, core, guest, session, etc.
}

// Member profile types
export interface Member {
  id: string;
  name: string;
  fullName: BilingualText;
  nickname: BilingualText;
  period: BilingualText;
  instruments: BilingualText[];
  role: BilingualText;
  albums: string[];
  otherProjects: BilingualText[];
  biography: BilingualText;
  image: string;
  birthYear: number;
  deathYear?: number;
  country: BilingualText;
}

// Discography types
export interface Album {
  id: string;
  title: string;
  year: number;
  type: 'studio' | 'live' | 'compilation' | 'ep';
  cover: string;
  description: BilingualText;
  tracks?: Track[];
  producer?: string;
  recordLabel?: string;
  duration?: string;
}

export interface Track {
  number: number;
  title: string;
  duration: string;
  writer?: string;
}

// Tour types
export interface TourDate {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  tour?: string;
  status?: 'confirmed' | 'sold-out' | 'cancelled' | 'postponed';
}

// Video types
export interface Video {
  id: string;
  title: string;
  year: number;
  url: string;
  type: 'music-video' | 'live' | 'documentary';
  description?: BilingualText;
  thumbnail?: string;
}

// DVD types
export interface DVD {
  id: string;
  title: string;
  year: number;
  cover: string;
  description: BilingualText;
  duration?: string;
  format?: string[];
  tracks?: DVDTrack[];
}

export interface DVDTrack {
  number: number;
  title: string;
  type: 'song' | 'documentary' | 'interview' | 'bonus';
  duration?: string;
}