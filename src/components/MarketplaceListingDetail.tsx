import { useState } from "react";
import { motion } from "framer-motion";
import { X, MapPin, Star, Heart, Share2, MessageCircle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import SellerProfileModal from "@/components/marketplace/SellerProfileModal";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  seller: string;
  sellerAvatar: string;
  location: string;
  category: string;
  condition: string;
  liked: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  postedDate?: string;
}

interface MarketplaceListingDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (sellerName: string) => void;
  isLiked: boolean;
  onToggleLike: () => void;
}

export default function MarketplaceListingDetail({
  product,
  isOpen,
  onClose,
  onContact,
  isLiked,
  onToggleLike,
}: MarketplaceListingDetailProps) {
  const [showSellerProfile, setShowSellerProfile] = useState(false);

  if (!product) return null;

  const otherSellerProducts = [
    { id: 101, title: "Wireless Earbuds", price: "$65", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", condition: "New" },
    { id: 102, title: "Phone Case Premium", price: "$25", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop", condition: "New" },
    { id: 103, title: "Laptop Stand", price: "$45", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", condition: "Like New" },
    { id: 104, title: "USB-C Hub", price: "$35", image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop", condition: "Excellent" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl p-0 overflow-hidden max-h-[90vh]">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Product Image */}
          <div className="relative w-full h-[300px] sm:h-[400px] bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {product.condition}
              </Badge>
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Title and Price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {product.title}
                </h2>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] bg-clip-text text-transparent mt-1">
                  {product.price}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={onToggleLike}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (product.rating || 4)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews || 12} reviews)
              </span>
            </div>

            {/* Location - Clickable */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm underline">{product.location}</span>
            </motion.button>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description ||
                  `This ${product.title.toLowerCase()} is in ${product.condition.toLowerCase()} condition. Perfect for anyone looking for quality at a great price. Feel free to contact the seller for more information or to arrange a viewing.`}
              </p>
            </div>

            <Separator />

            {/* Seller Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={product.sellerAvatar} />
                  <AvatarFallback>{product.seller[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.seller}</p>
                  <p className="text-sm text-muted-foreground">Member since 2023</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSellerProfile(true)}>
                  View Profile
                </Button>
              </div>
            </div>

            {/* Posted Date */}
            <p className="text-xs text-muted-foreground">
              Posted {product.postedDate || "3 days ago"}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] hover:opacity-90"
                onClick={() => onContact(product.seller)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" size="icon">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <SellerProfileModal
        isOpen={showSellerProfile}
        onClose={() => setShowSellerProfile(false)}
        sellerName={product.seller}
        sellerAvatar={product.sellerAvatar}
        otherProducts={otherSellerProducts}
      />
    </Dialog>
  );
}
