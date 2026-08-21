import React, { useState, useEffect } from 'react';
import { StoryItem } from '../../data/mobileSpiritualData';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';

interface MobileStoriesModalProps {
  story: StoryItem;
  onClose: () => void;
  onNextStory?: () => void;
  onPrevStory?: () => void;
}

export const MobileStoriesModal: React.FC<MobileStoriesModalProps> = ({
  story,
  onClose,
  onNextStory,
  onPrevStory,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const totalSlides = story.slides.length;

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else {
        if (onNextStory) {
          onNextStory();
          setCurrentSlideIndex(0);
        } else {
          onClose();
        }
      }
    }, (story.durationSec || 5) * 1000);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, isPaused, totalSlides, story, onNextStory, onClose]);

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else if (onNextStory) {
      onNextStory();
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else if (onPrevStory) {
      onPrevStory();
    }
  };

  const activeSlide = story.slides[currentSlideIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
      onClick={() => setIsPaused(!isPaused)}
    >
      <div 
        className={`relative w-full max-w-md h-[92vh] max-h-[780px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b ${story.imageBg} text-white flex flex-col justify-between p-6 border border-white/20`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bars */}
        <div className="space-y-3 z-20">
          <div className="flex items-center gap-1.5 w-full">
            {story.slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-[#D4A72C] transition-all duration-300 ${
                    idx < currentSlideIndex
                      ? 'w-full'
                      : idx === currentSlideIndex
                      ? 'w-full animate-pulse'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold text-xs shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white leading-tight">
                  {story.title}
                </h4>
                <p className="text-[10px] text-[#E8C158] font-mono">
                  {story.subtitle} • {story.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4A72C]" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Arabic Banner */}
        {story.arabicPhrase && (
          <div className="text-center font-serif text-lg sm:text-xl text-[#E8C158] drop-shadow-md py-2" dir="rtl">
            {story.arabicPhrase}
          </div>
        )}

        {/* Center Content Slide */}
        <div className="my-auto space-y-4 py-6 z-20">
          <div className="inline-block px-3 py-1 rounded-full bg-[#D4A72C]/20 border border-[#D4A72C]/40 text-[#D4A72C] text-xs font-mono font-bold">
            Étape {currentSlideIndex + 1} / {totalSlides}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
            {activeSlide.heading}
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans">
            {activeSlide.text}
          </p>

          {activeSlide.subtext && (
            <div className="text-xs text-white/70 italic font-sans pl-3 border-l-2 border-[#D4A72C]">
              {activeSlide.subtext}
            </div>
          )}

          {activeSlide.quote && (
            <div className="p-4 rounded-2xl bg-black/40 border border-[#D4A72C]/40 text-xs sm:text-sm text-[#E8C158] font-serif italic">
              {activeSlide.quote}
            </div>
          )}
        </div>

        {/* Navigation Touch Areas (Left & Right) */}
        <div 
          className="absolute inset-y-20 left-0 w-1/3 cursor-pointer z-10"
          onClick={handlePrev}
          title="Précédent"
        />
        <div 
          className="absolute inset-y-20 right-0 w-1/3 cursor-pointer z-10"
          onClick={handleNext}
          title="Suivant"
        />

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 z-20">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors py-1.5 px-3 rounded-xl bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-[11px] font-mono text-[#D4A72C] bg-black/40 px-3 py-1 rounded-full border border-white/10"
          >
            {isPaused ? '▶ En pause' : '⏸ Lecture auto'}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-xs text-[#0E4D3C] bg-[#D4A72C] hover:bg-[#E8C158] font-bold transition-colors py-1.5 px-3 rounded-xl shadow-md"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
