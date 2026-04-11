import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Calendar, ShieldCheck, ChevronDown, ChevronUp, ThumbsUp, MessageCircle, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SellerProduct {
  id: number;
  title: string;
  price: string;
  image: string;
  condition: string;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  liked: boolean;
  replies?: { user: string; avatar: string; comment: string; date: string }[];
}

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerAvatar: string;
  otherProducts: SellerProduct[];
  onProductSelect?: (product: SellerProduct) => void;
}

const mockReviews: Review[] = [
  { id: 1, user: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex2", rating: 5, comment: "Amazing seller! Product was exactly as described. Fast shipping and great communication throughout. Would definitely buy from again.", date: "2 days ago", likes: 12, liked: false, replies: [{ user: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", comment: "Thank you so much! Glad you loved it 😊", date: "1 day ago" }] },
  { id: 2, user: "Maria Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", rating: 4, comment: "Good quality product. Packaging could be better but overall satisfied with the purchase.", date: "1 week ago", likes: 5, liked: false },
  { id: 3, user: "James Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesW", rating: 5, comment: "Best deal I've found! The seller was very responsive and helpful. Highly recommend!", date: "2 weeks ago", likes: 8, liked: false },
  { id: 4, user: "Sophie Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", rating: 3, comment: "Product is okay. Took a bit longer to arrive than expected.", date: "3 weeks ago", likes: 2, liked: false },
  { id: 5, user: "Daniel Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel", rating: 5, comment: "Excellent! Exactly what I needed. Will purchase again.", date: "1 month ago", likes: 15, liked: false },
];

const ratingBreakdown = [
  { stars: 5, count: 45, percent: 60 },
  { stars: 4, count: 18, percent: 24 },
  { stars: 3, count: 8, percent: 11 },
  { stars: 2, count: 3, percent: 4 },
  { stars: 1, count: 1, percent: 1 },
];

export default function SellerProfileModal({
  isOpen,
  onClose,
  sellerName,
  sellerAvatar,
  otherProducts,
  onProductSelect,
}: SellerProfileModalProps) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const toggleLikeReview = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
      )
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Seller Profile</h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-5 pb-20">
          {/* Seller Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center gap-3"
          >
            <Avatar className="w-20 h-20 border-2 border-primary/30">
              <AvatarImage src={sellerAvatar} />
              <AvatarFallback className="text-2xl">{sellerName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5 justify-center">
                {sellerName}
                <ShieldCheck className="w-5 h-5 text-primary" />
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 justify-center">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> New York, NY</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined 2023</span>
              </div>
            </div>
            <div className="flex gap-6 mt-1">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{otherProducts.length + 1}</p>
                <p className="text-xs text-muted-foreground">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">4.8</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">75</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">98%</p>
                <p className="text-xs text-muted-foreground">Response</p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Rating Section - Clickable */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <button
              className="w-full text-left"
              onClick={() => setShowReviews(!showReviews)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-base">Ratings & Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= 4 ? "fill-yellow-500 text-yellow-500" : s === 5 ? "fill-yellow-500/50 text-yellow-500" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">4.8</span>
                    <span className="text-sm text-muted-foreground">(75 reviews)</span>
                  </div>
                </div>
                {showReviews ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </button>

            <AnimatePresence>
              {showReviews && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {/* Rating Breakdown */}
                  <div className="mt-4 space-y-2">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-muted-foreground">{r.stars}</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <Progress value={r.percent} className="h-2 flex-1" />
                        <span className="w-8 text-right text-muted-foreground text-xs">{r.count}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-foreground">{review.user}</p>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex mt-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{review.comment}</p>

                            {/* Like & Reply buttons */}
                            <div className="flex items-center gap-4 mt-2">
                              <button
                                className={`flex items-center gap-1 text-xs transition-colors ${review.liked ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                                onClick={() => toggleLikeReview(review.id)}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${review.liked ? "fill-primary" : ""}`} />
                                {review.likes > 0 && review.likes}
                              </button>
                              <button
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Reply {review.replies?.length ? `(${review.replies.length})` : ""}
                              </button>
                            </div>

                            {/* Replies */}
                            <AnimatePresence>
                              {expandedReview === review.id && review.replies && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-2 ml-2 pl-3 border-l-2 border-border space-y-2"
                                >
                                  {review.replies.map((reply, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <Avatar className="w-7 h-7">
                                        <AvatarImage src={reply.avatar} />
                                        <AvatarFallback>{reply.user[0]}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="text-xs font-medium text-foreground">{reply.user}</p>
                                          <span className="text-[10px] text-muted-foreground">{reply.date}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{reply.comment}</p>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {review.id !== reviews[reviews.length - 1].id && <Separator />}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Separator />

          {/* Other Products */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <h3 className="font-semibold text-foreground text-base mb-3">
              More from {sellerName}
            </h3>
            {otherProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {otherProducts.map((p) => (
                  <Card
                    key={p.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onProductSelect?.(p)}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <CardContent className="p-2">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{p.title}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{p.price}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">{p.condition}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No other listings at the moment.</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
