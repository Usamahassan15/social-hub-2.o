import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Flag,
  Pencil,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImagePreview from "@/components/ImagePreview";
import ShareSheet from "@/components/ShareSheet";
import ReportContentDialog from "@/components/ReportContentDialog";
import { toast } from "@/hooks/use-toast";

interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
}

interface MockPost {
  id: string;
  author: string;
  avatar: string;
  verified: boolean;
  time: string;
  content: string;
  images: string[];
  isOwner: boolean;
}

const MOCK_POSTS: Record<string, MockPost> = {
  "1": {
    id: "1",
    author: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    verified: true,
    time: "3h ago",
    content: "Sunset views from the rooftop tonight 🌇 Feeling grateful for moments like this.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900",
    ],
    isOwner: true,
  },
  "2": {
    id: "2",
    author: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    verified: false,
    time: "1d ago",
    content: "Weekend hike with the crew. Nature never disappoints!",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
    ],
    isOwner: false,
  },
};

const MOCK_LIKERS = [
  { id: "1", name: "Marcus Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
  { id: "2", name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: "3", name: "Jordan Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
  { id: "4", name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Priya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content: "This is stunning! Where was this taken?",
    time: "2h ago",
    likes: 4,
    liked: false,
    replies: [
      {
        id: "r1",
        author: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        content: "Thank you! It's from the downtown rooftop bar 🙌",
        time: "1h ago",
        likes: 1,
      },
    ],
  },
  {
    id: "c2",
    author: "Jordan Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    content: "Adding this to my bucket list ✨",
    time: "1h ago",
    likes: 2,
    liked: false,
    replies: [],
  },
];

const CURRENT_USER = {
  name: "Alex Johnson",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const post = id ? MOCK_POSTS[id] : undefined;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount] = useState(5);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showLikedByDialog, setShowLikedByDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [content, setContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (post) {
      setLikeCount(24);
      setContent(post.content);
      setEditContent(post.content);
    }
  }, [id]);

  const commentCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast({ title: isFollowing ? `Unfollowed ${post?.author}` : `Following ${post?.author}` });
  };

  const openImage = (index: number) => {
    setPreviewIndex(index);
    setShowImagePreview(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      content: newComment.trim(),
      time: "Just now",
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    toast({ title: "Comment posted!" });
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `r${Date.now()}`,
                  author: CURRENT_USER.name,
                  avatar: CURRENT_USER.avatar,
                  content: replyText.trim(),
                  time: "Just now",
                  likes: 0,
                },
              ],
            }
          : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  };

  const toggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleSaveEdit = () => {
    setContent(editContent);
    setIsEditing(false);
    toast({ title: "Post updated" });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    toast({ title: "Post deleted" });
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-[100vw] sm:max-w-xl lg:max-w-[640px] mx-auto px-0 sm:px-4 md:px-6 lg:px-0 py-3 sm:py-6">
          {loading ? (
            <div className="space-y-3 px-2 sm:px-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : !post ? (
            <ErrorState
              title="Post not found"
              description="This post may have been removed or doesn't exist."
              onBack={() => navigate(-1)}
            />
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <Card className="p-0 overflow-hidden rounded-lg sm:rounded-xl border border-border/30 sm:border-border">
                {/* Author row */}
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">{post.author}</h3>
                        {post.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                    {!post.isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFollow}
                        className={`h-7 px-2 text-xs ${isFollowing ? "text-muted-foreground" : "text-primary"}`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                        <Flag className="w-4 h-4 mr-2" />
                        Report Post
                      </DropdownMenuItem>
                      {post.isOwner && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setIsEditing(true); setEditContent(content); }}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Post
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content */}
                {isEditing ? (
                  <div className="px-3 pb-3 space-y-2">
                    <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-24 resize-none" />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-foreground px-3 pb-3 leading-relaxed">{content}</p>
                )}

                {/* Images */}
                {post.images.length > 0 && (
                  <div className={`grid ${post.images.length > 1 ? "grid-cols-2 gap-0.5" : "grid-cols-1"} bg-muted`}>
                    {post.images.map((img, i) => (
                      <button key={i} className="overflow-hidden cursor-pointer" onClick={() => openImage(i)}>
                        <img src={img} alt={`Post ${i + 1}`} className="w-full h-64 sm:h-80 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground px-3 py-2 border-b border-border">
                  <button onClick={() => setShowLikedByDialog(true)} className="hover:underline hover:text-foreground transition-colors">
                    {likeCount} likes
                  </button>
                  <div className="flex items-center gap-3">
                    <span>{commentCount} comments</span>
                    <span>{shareCount} shares</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-0.5 px-2 py-1">
                  <button onClick={handleLike} className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 rounded-md hover:bg-muted transition-colors">
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                    <span className="text-xs font-medium text-foreground">Like</span>
                  </button>
                  <button className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 rounded-md hover:bg-muted transition-colors">
                    <MessageCircle className="w-5 h-5 text-foreground" />
                    <span className="text-xs font-medium text-foreground">Comment</span>
                  </button>
                  <button onClick={() => setShowShareSheet(true)} className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 rounded-md hover:bg-muted transition-colors">
                    <Share2 className="w-5 h-5 text-foreground" />
                    <span className="text-xs font-medium text-foreground">Share</span>
                  </button>
                  <button onClick={() => setIsSaved((p) => !p)} className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 rounded-md hover:bg-muted transition-colors">
                    <Bookmark className={`w-5 h-5 ${isSaved ? "fill-primary text-primary" : "text-foreground"}`} />
                    <span className="text-xs font-medium text-foreground">Save</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="border-t border-border px-3 py-3 space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback>{c.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-xl px-3 py-2">
                            <p className="text-sm font-semibold text-foreground">{c.author}</p>
                            <p className="text-sm text-foreground">{c.content}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 pl-1 text-xs text-muted-foreground">
                            <span>{c.time}</span>
                            <button
                              onClick={() => toggleCommentLike(c.id)}
                              className={`font-medium hover:underline ${c.liked ? "text-primary" : ""}`}
                            >
                              Like{c.likes > 0 ? ` (${c.likes})` : ""}
                            </button>
                            <button
                              onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                              className="font-medium hover:underline"
                            >
                              Reply
                            </button>
                          </div>

                          {/* Replies */}
                          {c.replies.length > 0 && (
                            <div className="mt-2 pl-3 border-l border-border space-y-2">
                              {c.replies.map((r) => (
                                <div key={r.id} className="flex items-start gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={r.avatar} />
                                    <AvatarFallback>{r.author[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-muted rounded-xl px-3 py-1.5">
                                      <p className="text-xs font-semibold text-foreground">{r.author}</p>
                                      <p className="text-xs text-foreground">{r.content}</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 pl-1 text-[11px] text-muted-foreground">
                                      <span>{r.time}</span>
                                      <button className="font-medium hover:underline">Like{r.likes > 0 ? ` (${r.likes})` : ""}</button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply input */}
                          {replyingTo === c.id && (
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                placeholder={`Reply to ${c.author}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddReply(c.id)}
                                className="h-8 text-sm"
                              />
                              <Button size="sm" className="h-8 px-2" onClick={() => handleAddReply(c.id)} disabled={!replyText.trim()}>
                                <Send className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add comment */}
                <div className="flex items-center gap-2 px-3 py-3 border-t border-border">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={CURRENT_USER.avatar} />
                    <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()} className="h-9 px-3">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <MobileNav />

      {post && (
        <>
          <ImagePreview
            images={post.images}
            initialIndex={previewIndex}
            isOpen={showImagePreview}
            onClose={() => setShowImagePreview(false)}
          />
          <ShareSheet isOpen={showShareSheet} onClose={() => setShowShareSheet(false)} />
          <ReportContentDialog
            isOpen={showReportDialog}
            onClose={() => setShowReportDialog(false)}
            reportedContentId={post.id}
            contentType="post"
          />

          {/* Liked by dialog */}
          <Dialog open={showLikedByDialog} onOpenChange={setShowLikedByDialog}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Liked by</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                {MOCK_LIKERS.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{u.name}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete confirm */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
