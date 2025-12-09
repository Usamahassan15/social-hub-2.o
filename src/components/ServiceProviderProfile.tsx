import { Star, MapPin, Clock, MessageCircle, Award, Briefcase, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface Service {
  id: number;
  title: string;
  description: string;
  provider: string;
  providerAvatar: string;
  location: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  responseTime: string;
  image: string;
}

interface ServiceProviderProfileProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (providerName: string) => void;
}

export default function ServiceProviderProfile({
  service,
  isOpen,
  onClose,
  onContact,
}: ServiceProviderProfileProps) {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Provider Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Provider Header */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarImage src={service.providerAvatar} />
              <AvatarFallback>{service.provider[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg sm:text-xl text-foreground">{service.provider}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{service.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({service.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{service.location}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="font-bold">{service.rating}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Reviews</p>
                <p className="font-bold">{service.reviews}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Member</p>
                <p className="font-bold">2023</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Offered */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Service Offered</h4>
              <div className="flex items-start gap-3">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-1">{service.category}</Badge>
                  <h5 className="font-medium text-foreground">{service.title}</h5>
                  <p className="text-sm text-primary font-bold mt-1">{service.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">About This Service</h4>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>

          {/* Response Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{service.responseTime}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              onClick={() => onContact(service.provider)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
