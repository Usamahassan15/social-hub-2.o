import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😋", "😛", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😔", "😢", "😭", "😤", "🤬", "😱", "🥶", "🤢", "🤮", "😵", "🤯", "🥱", "😴"],
  "Gestures": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🦾"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💌"],
  "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐙"],
  "Food": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🍕", "🍔"],
  "Activities": ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🎿"],
  "Travel": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "✈️", "🛫", "🛬", "🛩️", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🏠", "🏡", "🏢", "🏣", "🏥"],
  "Objects": ["⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "⏱️", "⏲️"],
  "Symbols": ["❤️", "💯", "✨", "🔥", "💫", "⭐", "🌟", "✅", "❌", "⚠️", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "💬", "💭", "🗯️", "💤", "🎵", "🎶", "➕", "➖", "➗", "✖️", "♾️", "💲", "💱"],
};

export function EmojiPicker({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("Smileys");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute bottom-full mb-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="p-2 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Emoji</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-1 p-2 overflow-x-auto scrollbar-hide border-b border-border">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-2 h-48 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onEmojiSelect(emoji);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded-md transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EmojiButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiButton({ onEmojiSelect }: EmojiButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
      >
        <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
      </button>
      <EmojiPicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEmojiSelect={(emoji) => {
          onEmojiSelect(emoji);
          setIsOpen(false);
        }}
      />
    </div>
  );
}

export default EmojiPicker;
