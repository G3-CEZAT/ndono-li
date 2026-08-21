import React, { useState, useEffect } from 'react';
import { AUDIO_RECITATIONS, AudioRecitation } from '../../data/mobileSpiritualData';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Repeat, 
  BookOpen,
  X,
  Radio
} from 'lucide-react';

interface MobileAudioPlayerProps {
  currentTrackId?: string;
  onTrackChange?: (track: AudioRecitation) => void;
}

export const MobileAudioPlayer: React.FC<MobileAudioPlayerProps> = ({
  currentTrackId = 'audio-khilas-01',
}) => {
  const [currentTrack, setCurrentTrack] = useState<AudioRecitation>(
    AUDIO_RECITATIONS.find((t) => t.id === currentTrackId) || AUDIO_RECITATIONS[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  const durationSec = 275; // 4:35 approx

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= durationSec) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return 0;
          }
          const nextTime = prev + 1;
          const verseProgress = Math.min(
            currentTrack.verses.length - 1,
            Math.floor((nextTime / durationSec) * currentTrack.verses.length)
          );
          setActiveVerseIndex(verseProgress);
          return nextTime;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, isLooping, durationSec, currentTrack.verses.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTimeSec(val);
    const verseProgress = Math.min(
      currentTrack.verses.length - 1,
      Math.floor((val / durationSec) * currentTrack.verses.length)
    );
    setActiveVerseIndex(verseProgress);
  };

  const switchTrack = (track: AudioRecitation) => {
    setCurrentTrack(track);
    setCurrentTimeSec(0);
    setActiveVerseIndex(0);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Mini Floating Bar on Mobile */}
      <div 
        id="mobile-mini-audio-bar"
        className="fixed bottom-[74px] sm:bottom-20 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-40 bg-[#072B21]/95 backdrop-blur-md text-white border border-[#D4A72C]/40 rounded-2xl shadow-xl p-2.5 flex items-center justify-between gap-3 transition-all duration-300 hover:border-[#D4A72C]"
      >
        {/* Track Thumbnail & Title - Tap to expand */}
        <div 
          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="w-10 h-10 rounded-xl bg-[#0E4D3C] border border-[#D4A72C] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <Radio className="w-5 h-5 text-[#D4A72C] animate-pulse" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4A72C] rounded-full animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D4A72C] text-[#0E4D3C] font-bold font-mono">
                Audio Hadara
              </span>
              <span className="text-[10px] text-white/60 font-mono">
                {formatTime(currentTimeSec)} / {formatTime(durationSec)}
              </span>
            </div>
            <h4 className="font-serif font-bold text-xs text-white truncate">
              {currentTrack.title}
            </h4>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Agrandir avec paroles synchronisées"
          >
            <Maximize2 className="w-4 h-4 text-[#D4A72C]" />
          </button>
        </div>
      </div>

      {/* Fullscreen Player Modal with Synced Verses */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white rounded-t-3xl sm:rounded-3xl border border-[#D4A72C]/40 shadow-2xl p-6 space-y-5 max-h-[90vh] flex flex-col justify-between overflow-hidden">
            
            {/* Top Bar Modal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                <span className="text-xs font-mono font-bold uppercase text-[#D4A72C]">
                  Récitation & Chants de la Hadara
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const speeds: (1 | 1.25 | 1.5)[] = [1, 1.25, 1.5];
                    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIndex]);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#E8C158] border border-white/15"
                >
                  {playbackSpeed}x
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Track Switcher Tabs */}
            <div className="flex gap-2">
              {AUDIO_RECITATIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTrack(t)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif transition-all truncate ${
                    currentTrack.id === t.id
                      ? 'bg-[#D4A72C] text-[#0E4D3C] font-bold shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {t.title.split('—')[0]}
                </button>
              ))}
            </div>

            {/* Main Verses & Synchronized Lyrics Box */}
            <div className="flex-1 overflow-y-auto max-h-[300px] p-4 bg-black/30 rounded-2xl border border-white/10 space-y-4">
              <div className="text-center font-serif text-lg text-[#E8C158]" dir="rtl">
                {currentTrack.arabicTitle}
              </div>

              {currentTrack.verses.map((verse, idx) => {
                const isActive = idx === activeVerseIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#D4A72C]/20 border border-[#D4A72C] scale-102 shadow-sm'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="text-right font-serif text-base text-[#D4A72C] font-semibold" dir="rtl">
                      {verse.arabic}
                    </div>
                    <div className="text-xs text-white/90 italic font-mono mt-1">
                      {verse.phonetic}
                    </div>
                    <div className="text-xs text-[#E8C158] font-sans mt-0.5">
                      « {verse.french} »
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seek Bar & Timers */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={durationSec}
                value={currentTimeSec}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4A72C]"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/70">
                <span>{formatTime(currentTimeSec)}</span>
                <span>{formatTime(durationSec)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-xl transition-colors ${
                  isLooping ? 'text-[#D4A72C] bg-white/10' : 'text-white/40'
                }`}
                title="Répétition continue"
              >
                <Repeat className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const prevSec = Math.max(0, currentTimeSec - 15);
                    setCurrentTimeSec(prevSec);
                  }}
                  className="p-2 text-white/80 hover:text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    const nextSec = Math.min(durationSec, currentTimeSec + 15);
                    setCurrentTimeSec(nextSec);
                  }}
                  className="p-2 text-white/80 hover:text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="w-8" />
            </div>

          </div>
        </div>
      )}
    </>
  );
};
