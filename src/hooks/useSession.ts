"use client";

import { useState, useEffect } from "react";

export function useSession() {
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("raobahadur_username");
    if (stored) setUsername(stored);

    const storedUpvotes = localStorage.getItem("raobahadur_upvotes");
    if (storedUpvotes) {
      try {
        setUpvotedIds(JSON.parse(storedUpvotes));
      } catch (e) { }
    }

    const storedSaved = localStorage.getItem("raobahadur_saved");
    if (storedSaved) {
      try {
        setSavedIds(JSON.parse(storedSaved));
      } catch (e) { }
    }

    setIsReady(true);
  }, []);

  const login = (name: string) => {
    localStorage.setItem("raobahadur_username", name);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem("raobahadur_username");
    setUsername(null);
  };

  const toggleUpvote = (id: string, isUpvoted: boolean) => {
    setUpvotedIds(prev => {
      const next = isUpvoted
        ? [...new Set([...prev, id])]
        : prev.filter(i => i !== id);
      localStorage.setItem("raobahadur_upvotes", JSON.stringify(next));
      return next;
    });
  };

  const toggleSave = (id: string, isSaved: boolean) => {
    setSavedIds(prev => {
      const next = isSaved
        ? [...new Set([...prev, id])]
        : prev.filter(i => i !== id);
      localStorage.setItem("raobahadur_saved", JSON.stringify(next));
      return next;
    });
  };

  const hasUpvoted = (id: string) => upvotedIds.includes(id);
  const hasSaved = (id: string) => savedIds.includes(id);

  return { username, isReady, login, logout, hasUpvoted, toggleUpvote, hasSaved, toggleSave };
}
