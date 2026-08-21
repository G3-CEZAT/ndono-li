import React, { useState } from 'react';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  Play, 
  ExternalLink, 
  AlertCircle, 
  Film, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Clock,
  X
} from 'lucide-react';

export const PilgrimVideosView: React.FC = () => {
  const { videoResources } = PILGRIM_HOME_CONTENT;
  const [selectedVideo, setSelectedVideo] = useState<typeof videoResources.items[0] | null>(null);

  return (
    <div id="pilgrim-videos-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
            <Film className="w-3.5 h-3.5" />
            Médiathèque Documentaire
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Découvrir l'Histoire de Tivaouane en Vidéo
          </h1>
          <p className="text-[#E8C158] font-serif text-sm sm:text-base italic">
            « Retracer l'épopée de Maodo, la genèse de la Grande Zawiya et les hauts lieux de mémoire »
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
            Une sélection rigoureuse de reportages, documentaires et causeries retraçant l'évolution de Tivaouane, les mausolées et la vie de Seydi El Hadji Malick Sy (RTA).
          </p>
        </div>
      </div>

      {/* Protocol Alert Banner */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase font-mono">
            Protocole Éditorial & Conformité Pastorale :
          </span>
          <p className="leading-relaxed">
            Chaque ressource audiovisuelle externe fait l'objet d'un audit de conformité par le comité scientifique de la Zawiya avant certification définitive afin de garantir la stricte conformité théologique et historique avec les enseignements authentiques.
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videoResources.items.map((vid) => (
          <div
            key={vid.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-[#0E4D3C] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Visual Thumbnail / Player Action */}
            <div className="relative aspect-video bg-[#072B21] flex items-center justify-center p-4 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <button
                onClick={() => setSelectedVideo(vid)}
                className="relative z-10 w-16 h-16 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>

              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold bg-black/70 text-[#E8C158] backdrop-blur-xs font-mono">
                {vid.badge || vid.source}
              </span>

              {vid.duration && (
                <span className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md text-xs font-mono bg-black/80 text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4A72C]" />
                  <span>{vid.duration}</span>
                </span>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span className="text-[#0E4D3C] font-bold uppercase">Source : {vid.source}</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                    En cours de revue
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#0E4D3C] transition-colors leading-snug">
                  {vid.title}
                </h3>

                <div className="text-xs text-gray-500 italic font-medium">
                  {vid.narratorOrContext}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                  {vid.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="px-4 py-2 rounded-xl bg-[#0E4D3C] text-white hover:bg-[#1A6B54] font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Visionner l'extrait</span>
                </button>

                <a
                  href={vid.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0E4D3C] font-bold hover:text-[#D4A72C] flex items-center gap-1 transition-colors"
                >
                  <span>Lien YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E4D3C] text-white rounded-3xl max-w-2xl w-full overflow-hidden border border-[#D4A72C]/40 shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold">
                  {selectedVideo.source}
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video External Presentation */}
            <div className="bg-[#072B21] rounded-2xl p-6 text-center space-y-4 border border-white/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {selectedVideo.narratorOrContext}
                </p>
                <p className="text-xs text-white/70 max-w-md mx-auto">
                  {selectedVideo.synopsis}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4A72C] text-[#0E4D3C] font-bold text-xs hover:bg-[#E8C158] transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Ouvrir et regarder sur YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-white/60 bg-black/20 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D4A72C] flex-shrink-0" />
              <span>Conforme aux directives du Comité scientifique de Tivaouane.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
