import { useState } from "react";

interface RentImageCarouselProps {
  images: string[];
}

function RentImageCarousel({ images }: RentImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
        등록된 사진이 없습니다.
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-100">
      <img
        src={images[currentIndex]}
        alt={`rent-${currentIndex + 1}`}
        className="h-[420px] w-full object-cover"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold shadow"
          >
            ←
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold shadow"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}

export default RentImageCarousel;
