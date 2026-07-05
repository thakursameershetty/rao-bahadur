export type Tweet = { id: string; handle: string; name: string; text: string; likes: number };
export type Celeb = { id: string; name: string; role: string; quote: string; initial: string };
export type Review = { id: string; source: string; stars: number; snippet: string };
export type Theory = {
  id: string;
  title: string;
  author: string;
  body: string;
  upvotes: number;
  comments: number;
  tag: "Trending" | "Hidden Detail" | "New";
  locked?: boolean;
};
export type Comment = { id: string; theoryId: string; author: string; text: string; upvotes: number };

export const tweets: Tweet[] = [
  { id: "t1", handle: "@cinephile_ari", name: "Arindam K.", text: "The peacock throne scene had me in TEARS. Rao Bahadur is a fever dream. 🦚", likes: 12483 },
  { id: "t2", handle: "@filmnerd", name: "Priya S.", text: "Every frame is a painting. Every glance a war. This is cinema.", likes: 8721 },
  { id: "t3", handle: "@rao_army", name: "Vikram", text: "3rd watch. Still finding new details in the turban embroidery. GOAT.", likes: 22190 },
  { id: "t4", handle: "@popcornqueen", name: "Sana M.", text: "That interval block?? I stood up in the theater. STOOD UP.", likes: 15602 },
  { id: "t5", handle: "@mystic_mira", name: "Mira", text: "The mother's lullaby motif returns in the final battle. I'm not okay.", likes: 9834 },
  { id: "t6", handle: "@critic_deep", name: "Deepak R.", text: "A once-in-a-generation performance. Bow down.", likes: 18205 },
  { id: "t7", handle: "@theory_hunter", name: "Kabir", text: "The peacock feathers = each fallen ally. Count them. COUNT THEM.", likes: 31402 },
  { id: "t8", handle: "@bollywoodbabe", name: "Aisha", text: "Rewatching just for the score. Goosebumps every single time.", likes: 6540 },
];

export const celebs: Celeb[] = [
  { id: "c1", name: "Ranveer Kapoor", role: "Actor", quote: "I forgot I was watching a film. I lived inside it.", initial: "R" },
  { id: "c2", name: "Anushka Verma", role: "Director", quote: "A masterclass in restraint. Every silence speaks.", initial: "A" },
  { id: "c3", name: "Karan Malhotra", role: "Producer", quote: "This is the film we will all be chasing for the next decade.", initial: "K" },
  { id: "c4", name: "Deepa Iyer", role: "Critic, The Frame", quote: "Operatic. Devastating. Essential.", initial: "D" },
  { id: "c5", name: "Rahul Mehra", role: "Composer", quote: "The score haunts me. I haven't slept the same since.", initial: "R" },
  { id: "c6", name: "Naina Rao", role: "Journalist", quote: "Rao Bahadur is not a character. He is a movement.", initial: "N" },
];

export const reviews: Review[] = [
  { id: "r1", source: "Screen Weekly", stars: 5, snippet: "A thunderclap of a film. Cinema at its most operatic and unflinching." },
  { id: "r2", source: "The Reel Post", stars: 5, snippet: "Every performance is a monument. You leave the hall trembling." },
  { id: "r3", source: "Filmscope", stars: 4.5, snippet: "Gorgeously shot, mercilessly staged. A career-defining turn." },
  { id: "r4", source: "Frame By Frame", stars: 5, snippet: "The kind of film that reminds you why you fell in love with movies." },
];

export const theories: Theory[] = [
  {
    id: "th1",
    title: "The Peacock Feather Count",
    author: "kabir_watches",
    body: "If you pay close attention during the climactic battle, every time one of Rao's allies falls, a single peacock feather subtly appears in the background... seven. In the final tableau — eighteen. Each corresponds to a named death, in order. The costume department has been receipts-level meticulous.",
    upvotes: 4821, comments: 214, tag: "Hidden Detail",
  },
  {
    id: "th2",
    title: "The Broken Lullaby",
    author: "mira_theories",
    body: "Notice the background score during the flashback sequence. The mother's lullaby plays exactly 5 times... 00:47, 01:22, 01:58, and 02:41. Each cue is followed within 90 seconds by Rao breaking a vow. It's not nostalgia. It's a metronome for his moral collapse.",
    upvotes: 3902, comments: 187, tag: "Trending",
  },
  {
    id: "th3",
    title: "No Reflection",
    author: "ghost_frame",
    body: "During the intense mirror monologue in Act 2, pause at 1:14:22. Rao's reflection is missing...off by half a beat. Ghost lore, or a director winking that the entire film is a memory told from the other side? The final scene confirms it — or does it?",
    upvotes: 6210, comments: 402, tag: "Trending",
  },
  {
    id: "th4",
    title: "Color Grading Tells the Story",
    author: "colorist_anon",
    body: "Has anyone else noticed the color shift? The first half of the movie is bathed in warm gold... peacock teal. The tipping point is the courtyard scene — the exact moment he lies to his brother. From there, no scene returns to gold.",
    upvotes: 2984, comments: 96, tag: "Hidden Detail",
  },
  {
    id: "th5",
    title: "The Emerald Ring",
    author: "narrative_nerd",
    body: "The emerald ring isn't just a prop. It's passed between characters subtly...e line of dialogue about it. Whoever wears it makes the film's worst decision within the next scene. It's a cursed object hiding in plain sight.",
    upvotes: 1874, comments: 63, tag: "New",
  },
  {
    id: "th6",
    title: "He Never Gets Wet",
    author: "weatherman",
    body: "It rains in almost every major scene, but look closely at Rao. He never gets wet...ouched. The one time a drop lands on his cheek is the frame before his final choice.",
    upvotes: 2401, comments: 118, tag: "Hidden Detail",
  },
];

export const comments: Comment[] = [
  { id: "cm1", theoryId: "th1", author: "eagle_eye", text: "I paused and counted. It's real. This is unhinged detail work.", upvotes: 231 },
  { id: "cm2", theoryId: "th1", author: "costume_stan", text: "The costume designer confirmed this on IG. THE RECEIPTS.", upvotes: 502 },
  { id: "cm3", theoryId: "th3", author: "ghost_frame", text: "I've watched it four times to check. I am shaking.", upvotes: 189 },
];
