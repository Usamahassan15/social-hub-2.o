export interface SavedPost {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export const savedPostsMock: SavedPost[] = [
  {
    id: 1,
    author: "Olivia Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    time: "2 days ago",
    content: "10 travel photography tips that changed my workflow forever 📸",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    likes: 482,
    comments: 37,
  },
  {
    id: 2,
    author: "David Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    time: "5 days ago",
    content: "A clean guide to writing maintainable React components. Bookmark this one!",
    likes: 219,
    comments: 24,
  },
  {
    id: 3,
    author: "Ava Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    time: "1 week ago",
    content: "Weekend recipe: 20-minute garlic butter pasta 🍝",
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&h=600&fit=crop",
    likes: 651,
    comments: 58,
  },
];
