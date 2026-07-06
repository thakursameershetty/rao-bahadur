import { create } from 'zustand';

export type Character = {
  id: string;
  name: string;
  image: string;
  likes: number;
};

interface CharactersState {
  characters: Character[];
  likeCharacter: (id: string, increment: boolean) => Promise<void>;
  fetchCharacters: () => Promise<void>;
}

const defaultCharacters: Character[] = [
  { id: 'Achamma', name: 'Achamma', image: 'https://res.cloudinary.com/uohqyl93/image/upload/raobahadur/characters/Achamma.jpg', likes: 0 },
  { id: 'Achari', name: 'Achari', image: 'https://res.cloudinary.com/uohqyl93/image/upload/raobahadur/characters/Achari.jpg', likes: 0 },
  { id: 'Kusuma', name: 'Kusuma', image: 'https://res.cloudinary.com/uohqyl93/image/upload/raobahadur/characters/Kusuma.jpg', likes: 0 },
  { id: 'Renuka', name: 'Renuka', image: 'https://res.cloudinary.com/uohqyl93/image/upload/raobahadur/characters/Renuka.jpg', likes: 0 },
];

export const useCharactersStore = create<CharactersState>((set) => ({
  characters: defaultCharacters,
  fetchCharacters: async () => {
    try {
      const res = await fetch('/api/characters');
      if (res.ok) {
        const dbCharacters = await res.json();
        set((state) => ({
          characters: state.characters.map((c) => {
            const dbChar = dbCharacters.find((dbC: any) => dbC.id === c.id);
            return dbChar ? { ...c, likes: dbChar.likes } : c;
          }),
        }));
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  },
  likeCharacter: async (id, increment) => {
    // Optimistic update
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === id ? { ...c, likes: c.likes + (increment ? 1 : -1) } : c
      ),
    }));

    // API Call
    try {
      await fetch(`/api/characters/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isUpvoted: increment }),
      });
    } catch (error) {
      console.error('Failed to update character likes:', error);
      // Revert optimistic update on failure
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? { ...c, likes: c.likes + (increment ? -1 : 1) } : c
        ),
      }));
    }
  },
}));
