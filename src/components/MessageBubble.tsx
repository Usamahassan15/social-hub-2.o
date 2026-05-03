import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Reply, MoreVertical, Copy, Forward, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  sender: "user" | "other";
  content: string;
  time: string;
  replyTo?: {
    content: string;
    sender: string;
  };
}

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message) => void;
  onDelete?: (id: number) => void;
}

const MessageBubble = ({ message, onReply, onDelete }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // Swipe threshold for reply action
    const threshold = 60;
    if (message.sender === "other" && info.offset.x > threshold) {
      onReply(message);
    } else if (message.sender === "user" && info.offset.x < -threshold) {
      onReply(message);
    }
  };

  const isUser = message.sender === "user";

  return (
    <div 
      ref={constraintsRef}
      className={`flex ${isUser ? "justify-end" : "justify-start"} group relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Reply indicator - shows during swipe */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-1/2 -translate-y-1/2 ${isUser ? "right-[calc(100%-20px)]" : "left-[calc(100%-20px)]"}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Reply className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions for desktop (hover) */}
      <AnimatePresence>
        {showActions && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${
              isUser ? "right-[calc(70%+8px)]" : "left-[calc(70%+8px)]"
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-muted/80"
              onClick={() => onReply(message)}
            >
              <Reply className="w-3.5 h-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-muted/80">
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? "end" : "start"}>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(message.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag="x"
        dragConstraints={{ left: isUser ? -80 : 0, right: isUser ? 0 : 80 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className={`max-w-[70%] cursor-grab active:cursor-grabbing ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        } rounded-2xl px-4 py-3`}
      >
        {/* Reply preview */}
        {message.replyTo && (
          <div className={`mb-2 pl-2 border-l-2 ${isUser ? "border-primary-foreground/50" : "border-primary/50"}`}>
            <p className={`text-xs font-medium ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {message.replyTo.sender}
            </p>
            <p className={`text-xs line-clamp-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground/80"}`}>
              {message.replyTo.content}
            </p>
          </div>
        )}
        
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {message.time}
        </p>
      </motion.div>
    </div>
  );
};

export default MessageBubble;
