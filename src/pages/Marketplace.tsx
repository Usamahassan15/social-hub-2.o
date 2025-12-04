import { ShoppingBag, Search, Filter, MapPin, Tag, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  },
];

export default function Marketplace() {
  const [likedProducts, setLikedProducts] = useState<number[]>(
    products.filter(p => p.liked).map(p => p.id)
  );

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="flex-1 md:ml-64 pb-16 md:pb-8 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-5 md:mb-6"
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
              Marketplace
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Buy and sell items in your community</p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-4"
          >
            {/* Search Bar and Post Button */}
            <div className="flex gap-2 md:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for items..." 
                  className="pl-10 h-12 rounded-lg"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0 rounded-lg">
                <Filter className="w-5 h-5" />
              </Button>
              <Button 
                className="h-12 px-4 md:px-6 flex-shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg font-semibold"
              >
                <ShoppingBag className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Post Listing</span>
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="default" size="sm" className="flex-shrink-0 rounded-full">All</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Electronics</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Fashion</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Gaming</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Sports</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">Photography</Button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group rounded-lg sm:rounded-xl border-border/50">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Heart Icon */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
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
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors ${likedProducts.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                        />
                      </Button>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-sm text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        {product.condition}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-2 sm:p-3 md:p-4">
                    {/* Product Info */}
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-foreground line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.title}
                      </h3>

                      <p className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[hsl(199,100%,50%)] to-[hsl(207,90%,54%)] bg-clip-text text-transparent">
                        {product.price}
                      </p>

                      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground pt-0.5 sm:pt-1">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{product.location}</span>
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
            className="mt-8 text-center pb-6"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Load More Products
            </Button>
          </motion.div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
