import { ShoppingBag, Search, Filter, MapPin, Tag, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
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
      
      <main className="flex-1 md:ml-64 pb-20 sm:pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
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
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for items..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-shrink-0">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="default" size="sm" className="flex-shrink-0">All</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">Electronics</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">Fashion</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">Gaming</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">Sports</Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">Photography</Button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 ${likedProducts.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {product.condition}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Product Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
                          {product.title}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          <Tag className="w-3 h-3 mr-1" />
                          {product.category}
                        </Badge>
                      </div>

                      <p className="text-2xl font-bold text-primary">
                        {product.price}
                      </p>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{product.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex items-center gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={product.sellerAvatar} />
                      <AvatarFallback>{product.seller[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.seller}</p>
                    </div>
                  </CardFooter>
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
