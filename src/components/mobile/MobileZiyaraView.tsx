import React, { useState } from 'react';
import { HOLY_PLACES, HolyPlace } from '../../data/mobileSpiritualData';
import { 
  MapPin, 
  Compass, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Navigation, 
  Heart,
  BookOpen,
  Info,
  X
} from 'lucide-react';

export const MobileZiyaraView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activePlace, setActivePlace] = useState<HolyPlace | null>(null);
  const [isPlayingGuide, setIsPlayingGuide] = useState<string | null>(null);

  const categories = ['Tous', 'Mausolée', 'Zawiya', 'Mosquée', 'Cimetière'];

  const filteredPlaces = selectedCategory === 'Tous'
    ? HOLY_PLACES
    : HOLY_PLACES.filter((p) => p.category === selectedCategory);

  const toggleAudioGuide = (id: string) => {
    if (isPlayingGuide === id) {
      setIsPlayingGuide(null);
    } else {
      setIsPlayingGuide(id);
    }
  };

  return (
    <div id="mobile-ziyara-view" className="space-y-6 pb-24 text-[#1A1A1A]">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white p-5 rounded-3xl border border-[#D4A72C]/40 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono">
            Guide Sacré • Tivaouane
          </span>
          <span className="text-xs text-[#E8C158] font-mono flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#D4A72C]" />
            5 Hauts Lieux
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            La Ziyâra & Les Sanctuaires Saints
          </h2>
          <p className="text-xs text-white/80 leading-snug pt-0.5">
            Mausolées, Grande Zawiya et hauts lieux de mémoire : parcours initiatique, convenances (Adab) et invocations recommandées.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0E4D3C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Places List */}
      <div className="space-y-4">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden p-5 space-y-3"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-[#0E4D3C]/10 text-[#0E4D3C] px-2 py-0.5 rounded-md">
                    {place.category}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4A72C]" />
                    {place.distance}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-gray-900 leading-snug">
                  {place.name}
                </h3>

                <div className="text-xs font-serif text-[#D4A72C]" dir="rtl">
                  {place.arabicName}
                </div>
              </div>

              <button
                onClick={() => setActivePlace(place)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-[#0E4D3C] hover:text-white text-gray-500 transition-colors flex-shrink-0"
                title="Voir le guide complet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {place.history}
            </p>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span className="truncate max-w-[150px]">{place.visitingHours}</span>
              </div>

              <div className="flex items-center gap-2">
                {place.audioGuideTitle && (
                  <button
                    onClick={() => toggleAudioGuide(place.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      isPlayingGuide === place.id
                        ? 'bg-[#D4A72C] text-[#0E4D3C]'
                        : 'bg-[#F4F6F5] text-[#0E4D3C] hover:bg-gray-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingGuide === place.id ? 'Lecture...' : 'Audio'}</span>
                  </button>
                )}

                <button
                  onClick={() => setActivePlace(place)}
                  className="px-3 py-1 rounded-xl bg-[#0E4D3C] text-white hover:bg-[#1A6B54] text-[11px] font-bold transition-colors"
                >
                  Adab & Du'a
                </button>
              </div>
            </div>

            {/* Audio Guide Player Box if playing */}
            {isPlayingGuide === place.id && (
              <div className="p-3 rounded-2xl bg-[#072B21] text-white text-xs space-y-2 border border-[#D4A72C]/40 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#D4A72C]">
                    🎙️ Guide Audio : {place.audioGuideTitle}
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    {place.audioGuideDuration}
                  </span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4A72C] w-1/3 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Place Details Modal (Adab & Recommended Du'a) */}
      {activePlace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-gray-200">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#0E4D3C] text-[#D4A72C] px-2.5 py-0.5 rounded">
                  {activePlace.category} • Guide du Pèlerin
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0E4D3C] mt-1">
                  {activePlace.name}
                </h3>
                <div className="text-sm font-serif text-[#D4A72C]" dir="rtl">
                  {activePlace.arabicName}
                </div>
              </div>

              <button
                onClick={() => setActivePlace(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History & Context */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-500">
                Histoire & Signification Spirituelle
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {activePlace.history}
              </p>
            </div>

            {/* Adab Rules */}
            <div className="space-y-2 bg-[#F4F6F5] p-4 rounded-2xl border border-gray-200">
              <h4 className="text-xs font-mono font-bold uppercase text-[#0E4D3C] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4A72C]" />
                <span>Convenances de la Ziyâra (Adab) :</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {activePlace.adab.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#0E4D3C] font-bold">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Dua */}
            <div className="space-y-2 bg-[#0E4D3C] text-white p-4 rounded-2xl border border-[#D4A72C]/40">
              <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold">
                Invocation recommandée sur place :
              </span>
              <div className="text-right font-serif text-base text-[#E8C158] leading-relaxed" dir="rtl">
                {activePlace.recommendedDua}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActivePlace(null)}
              className="w-full py-3 rounded-2xl bg-[#0E4D3C] text-white font-bold text-xs sm:text-sm hover:bg-[#1A6B54] transition-colors"
            >
              Fermer le Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
