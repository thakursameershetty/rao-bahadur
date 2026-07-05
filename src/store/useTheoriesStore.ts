import { create } from 'zustand';
import { theories as initialTheories, comments as initialComments, Theory, Comment } from '@/data/mock';

interface TheoriesState {
  theories: Theory[];
  comments: Comment[];
  addTheory: (theory: Omit<Theory, 'id' | 'comments' | 'upvotes'>) => void;
  upvoteTheory: (id: string) => void;
  addComment: (theoryId: string, author: string, text: string) => void;
}

export const useTheoriesStore = create<TheoriesState>((set) => ({
  theories: initialTheories,
  comments: initialComments,
  addTheory: (theory) => set((state) => ({
    theories: [
      {
        ...theory,
        id: `t${Date.now()}`,
        comments: 0,
        upvotes: 0,
      },
      ...state.theories
    ]
  })),
  upvoteTheory: (id) => set((state) => ({
    theories: state.theories.map(t =>
      t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t
    )
  })),
  addComment: (theoryId, author, text) => set((state) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      theoryId,
      author,
      text,
      upvotes: 0
    };
    return {
      comments: [...state.comments, newComment],
      theories: state.theories.map(t =>
        t.id === theoryId
          ? { ...t, comments: t.comments + 1 }
          : t
      )
    };
  }),
}));
