import { useState } from 'react';
import PostImageLightbox from './PostImageLightbox';

interface ImageData {
  original: string;
  thumbnail: string;
}

interface PostImageGridProps {
  images: ImageData[];
}

const PostImageGrid = ({ images }: PostImageGridProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {images.length > 0 && (
        <div>
          {images.length >= 5 ? (
            <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[350px] md:h-[500px]">
              <div
                onClick={() => openLightbox(0)}
                className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0].original}
                  alt="Main property"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {images.slice(1, 3).map((image, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index + 1)}
                  className="relative group cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.original}
                    alt={`Property ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}

              {images.slice(3, 5).map((image, index) => (
                <div
                  key={index + 3}
                  onClick={() => openLightbox(index + 3)}
                  className="relative group cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.original}
                    alt={`Property ${index + 4}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {index === 1 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <span className="text-white text-2xl font-bold block">
                          +{images.length - 5}
                        </span>
                        <span className="text-white text-sm">รูปภาพ</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : images.length === 1 ? (
            <div
              onClick={() => openLightbox(0)}
              className="rounded-xl overflow-hidden max-h-[600px] cursor-pointer group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0].original}
                alt="Property"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div
              className={`grid gap-2 rounded-xl overflow-hidden ${
                images.length === 2
                  ? 'grid-cols-2'
                  : images.length === 3
                    ? 'grid-cols-3'
                    : 'grid-cols-2'
              } h-[400px]`}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative group cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.original}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <PostImageLightbox
        images={images}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </>
  );
};

export default PostImageGrid;
