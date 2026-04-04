import { ShoppingBag, Search, Filter, MapPin, Heart } from "lucide-react";
import ImagePreview from "@/components/ImagePreview";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MarketplaceListingDetail from "@/components/MarketplaceListingDetail";
import CreateListingModal from "@/components/CreateListingModal";

const products = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: "$120",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    seller: "John Doe",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "New York, NY",
    category: "Fashion",
    condition: "Like New",
    liked: false,
    rating: 4.5,
    reviews: 23,
  },
  {
    id: 2,
    title: "MacBook Pro 16-inch",
    price: "$1,800",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    seller: "Sarah Johnson",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "San Francisco, CA",
    category: "Electronics",
    condition: "Used",
    liked: true,
    rating: 4.8,
    reviews: 45,
  },
  {
    id: 3,
    title: "Vintage Camera",
    price: "$350",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
    seller: "Mike Chen",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "Los Angeles, CA",
    category: "Photography",
    condition: "Excellent",
    liked: false,
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 4,
    title: "Designer Handbag",
    price: "$450",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    seller: "Emma Wilson",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    location: "Miami, FL",
    category: "Fashion",
    condition: "New",
    liked: false,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: 5,
    title: "Gaming Console",
    price: "$400",
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=400&fit=crop",
    seller: "Jake Thompson",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake",
    location: "Austin, TX",
    category: "Gaming",
    condition: "Like New",
    liked: false,
    rating: 4.6,
    reviews: 32,
  },
  {
    id: 6,
    title: "Wireless Headphones",
    price: "$180",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    seller: "Olivia Brown",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    location: "Seattle, WA",
    category: "Electronics",
    condition: "New",
    liked: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 7,
    title: "Mountain Bike",
    price: "$600",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=400&fit=crop",
    seller: "Alex Martinez",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    location: "Denver, CO",
    category: "Sports",
    condition: "Used",
    liked: false,
    rating: 4.4,
    reviews: 15,
  },
  {
    id: 8,
    title: "Smart Watch",
    price: "$250",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    seller: "Lisa Anderson",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    location: "Boston, MA",
    category: "Electronics",
    condition: "Excellent",
    liked: false,
    rating: 4.7,
    reviews: 56,
  },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState<number[]>(
    products.filter((p) => p.liked).map((p) => p.id)
  );
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = categoryTabsRef.current;
    if (!el) return;
    const markEvent = (e: TouchEvent) => {
      (e as any).__storySwipe = true;
    };
    el.addEventListener('touchstart', markEvent, { passive: true });
    el.addEventListener('touchend', markEvent, { passive: true });
    el.addEventListener('touchmove', markEvent, { passive: true });
    return () => {
      el.removeEventListener('touchstart', markEvent);
      el.removeEventListener('touchend', markEvent);
      el.removeEventListener('touchmove', markEvent);
    };
  }, []);

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleContactSeller = (sellerName: string) => {
    setSelectedProduct(null);
    navigate("/messages");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-14">
        <div className="w-full px-1 sm:px-4 md:px-2 lg:px-2 pt-0 md:pt-6 overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 px-3 md:px-0"
          >
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 md:mb-2">
              Marketplace
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Buy and sell items in your community
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 md:mb-6 space-y-3 md:space-y-4 px-3 md:px-0"
          >
            {/* Search Bar and Post Button */}
            <div className="flex gap-2 md:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search for items..." className="pl-10 h-10 md:h-12 rounded-lg" />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-lg"
              >
                <Filter className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                className="h-10 md:h-12 px-3 md:px-6 flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg font-semibold"
                onClick={() => setShowCreateListing(true)}
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
                <span className="hidden md:inline">Post Listing</span>
              </Button>
            </div>

            {/* Category Filters */}
            <div ref={categoryTabsRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="default" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                All
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                Electronics
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                Fashion
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                Gaming
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                Sports
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full text-xs md:text-sm">
                Photography
              </Button>
            </div>
          </motion.div>

          {/* Products Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3 md:gap-4 px-0 sm:px-3 md:px-0">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="w-full"
              >
                <Card
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group w-full h-auto rounded-md md:rounded-xl border border-border/50"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image - Responsive aspect ratio */}
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreviewSrc(product.image);
                        setImagePreviewOpen(true);
                      }}
                    />

                    {/* Heart Icon */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            likedProducts.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 md:bottom-3 md:left-3">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-sm shadow-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
                      >
                        {product.condition}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-2 sm:p-3 md:p-4">
                    {/* Product Info - Responsive text sizing */}
                    <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-foreground line-clamp-2 leading-tight">
                        {product.title}
                      </h3>

                      <p className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {product.price}
                      </p>

                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="line-clamp-1 break-all">{product.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 sm:mt-8 text-center pb-6"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Load More Products
            </Button>
          </motion.div>
        </div>
      </main>

      <MobileNav />

      {/* Listing Detail Modal */}
      <MarketplaceListingDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onContact={handleContactSeller}
        isLiked={selectedProduct ? likedProducts.includes(selectedProduct.id) : false}
        onToggleLike={() => selectedProduct && toggleLike(selectedProduct.id)}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
      />

      <ImagePreview
        images={imagePreviewSrc ? [imagePreviewSrc] : []}
        isOpen={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
      />
    </div>
  );
}
