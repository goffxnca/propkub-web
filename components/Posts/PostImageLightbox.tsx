import { useState, useEffect, useCallback } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface ImageData {
  original: string;
  thumbnail: string;
}

interface PostImageLightboxProps {
  images: ImageData[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const PostImageLightbox = ({ 
  images, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: PostImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <XIcon className="w-8 h-8" />
      </button>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      <div className="relative w-full h-full flex items-center justify-center p-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[currentIndex].original}
          alt={`Property ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl w-full px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center py-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="flex-shrink-0 p-0.5 transition-all rounded-lg"
              >
                <div 
                  className={`w-20 h-20 rounded-md overflow-hidden transition-all ${
                    currentIndex === index
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.original}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Close overlay"
      />
    </div>
  );
};

export default PostImageLightbox;

