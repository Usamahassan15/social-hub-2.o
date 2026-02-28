import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreview({ images, initialIndex = 0, isOpen, onClose }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, images.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(i => i - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, goNext, goPrev]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    } else if (info.offset.x < -80) {
      goNext();
    } else if (info.offset.x > 80) {
      goPrev();
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-[110] text-white hover:bg-white/20 h-10 w-10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] text-white/80 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 md:left-4 z-[110] text-white hover:bg-white/20 h-10 w-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 md:right-4 z-[110] text-white hover:bg-white/20 h-10 w-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}

          {/* Image */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              src={images[currentIndex]}
              alt=""
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg select-none"
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
