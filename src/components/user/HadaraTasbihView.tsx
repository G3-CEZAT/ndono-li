import React, { useState } from 'react';
import { 
  Flame, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Check, 
  CalendarCheck,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  playTasbihTick, 
  playTasbihComplete, 
  triggerHaptic 
} from '../../utils/audioFeedback';

interface TasbihPreset {
  id: string;
  name: string;
  nameArabic: string;
  target: number;
  description: string;
  category: 'Lâzim' | 'Wadhîfa' | 'Surérogatoire';
  merits: string;
}

const PRESETS: TasbihPreset[] = [
  {
    id: 'fatih',
    name: 'Salât al-Fâtih',
    nameArabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ',
    target: 100,
    description: 'Prière sur le Prophète (PSL) transmise dans la Tijâniyya.',
    category: 'Lâzim',
    merits: 'Ouvre les portes de la miséricorde et rapproche de l’essence prophétique.',
  },
  {
    id: 'istighfar',
    name: 'Astaghfirullâh',
    nameArabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ',
    target: 100,
    description: 'Demande de pardon divin et purification du cœur.',
    category: 'Lâzim',
    merits: 'Efface les péchés et illumine la clairvoyance intérieure.',
  },
  {
    id: 'tawhid',
    name: 'Lâ ilâha illa Allâh',
    nameArabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    target: 100,
    description: 'Attestation de l’Unicité absolue de Dieu (Tawhîd).',
    category: 'Lâzim',
    merits: 'La meilleure des paroles prononcées par les Prophètes.',
  },
  {
    id: 'jawhara',
    name: 'Jawharat al-Kamâl',
    nameArabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ',
    target: 12,
    description: 'Récitée 12 fois lors de la Wadhîfa quotidienne avec pureté d’eau.',
    category: 'Wadhîfa',
    merits: 'Présence spirituelle sublime et bénédictions immenses.',
  },
  {
    id: 'latif',
    name: 'Yâ Latîf',
    nameArabic: 'يَا لَطِيفُ يَا كَرِيمُ',
    target: 129,
    description: 'Invocation pour l’apaisement, la miséricorde et le dénouement.',
    category: 'Surérogatoire',
    merits: 'Dénoue les épreuves et apporte la quiétude dans les foyers.',
  },
];

interface DailyWirdItem {
  id: string;
  name: string;
  time: string;
  formula: string;
  done: boolean;
}

export const HadaraTasbihView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<TasbihPreset>(PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [showWirdChecklist, setShowWirdChecklist] = useState<boolean>(false);

  const [dailyWirds, setDailyWirds] = useState<DailyWirdItem[]>([
    {
      id: 'lazim-matin',
      name: 'Lâzim du Matin',
      time: 'Après Fajr / Subh',
      formula: '100 Istighfâr • 100 Salât Fâtih • 100 Haylala',
      done: true,
    },
    {
      id: 'wadhifa',
      name: 'Wadhîfa Communautaire',
      time: 'Après-midi / Maghrib',
      formula: '30 Istighfâr • 50 Fâtih • 100 Haylala • 12 Jawhara',
      done: false,
    },
    {
      id: 'lazim-soir',
      name: 'Lâzim du Soir',
      time: 'Après ‘Asr ou ‘Ishâ',
      formula: '100 Istighfâr • 100 Salât Fâtih • 100 Haylala',
      done: false,
    },
    {
      id: 'haylala-vendredi',
      name: 'Haylala du Vendredi',
      time: 'Vendredi après ‘Asr',
      formula: 'Récitation collective de Lâ ilâha illa Allâh',
      done: false,
    },
  ]);

  const handleIncrement = () => {
    triggerHaptic(20);
    if (soundEnabled) {
      playTasbihTick();
    }

    const nextCount = count + 1;
    if (nextCount >= selectedPreset.target) {
      triggerHaptic(50);
      if (soundEnabled) {
        playTasbihComplete();
      }
      setCompletedRounds((prev) => prev + 1);
      setCount(0);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    triggerHaptic(15);
    setCount(0);
  };

  const toggleWird = (wirdId: string) => {
    triggerHaptic(10);
    setDailyWirds((prev) =>
      prev.map((w) => (w.id === wirdId ? { ...w, done: !w.done } : w))
    );
  };

  const progressPercent = Math.min(100, Math.round((count / selectedPreset.target) * 100));

  return (
    <div id="hadara-tasbih-view" className="max-w-xl mx-auto w-full space-y-4">
      
      {/* Preset Selector Pill Bar */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 touch-pan-x">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              triggerHaptic(10);
              setSelectedPreset(p);
              setCount(0);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] transition-all touch-manipulation active:scale-95 ${
              selectedPreset.id === p.id
                ? 'bg-[#0E4D3C] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{p.name}</span>
            <span className="ml-1 opacity-70 font-mono text-[11px]">({p.target})</span>
          </button>
        ))}
      </div>

      {/* Main Touch Counter Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm text-center space-y-5">
        
        {/* Title & Arabic */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0E4D3C] bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              {selectedPreset.category}
            </span>
            <span className="text-[10px] font-mono text-[#D4A72C] font-bold">
              Objectif : {selectedPreset.target}
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#072B21]">
            {selectedPreset.name}
          </h3>

          <p className="text-sm sm:text-base text-[#0E4D3C] font-serif py-1 max-w-md mx-auto leading-relaxed" dir="rtl">
            {selectedPreset.nameArabic}
          </p>

          <p className="text-xs text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
            {selectedPreset.description}
          </p>
        </div>

        {/* Big Tactile Circular Tap Button */}
        <div className="py-2 flex justify-center">
          <button
            onClick={handleIncrement}
            className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#072B21] via-[#0A3D2F] to-[#0E4D3C] text-white flex flex-col items-center justify-center p-6 shadow-xl active:scale-95 transition-all border-4 border-[#D4A72C]/40 relative group cursor-pointer focus:outline-none touch-manipulation select-none"
          >
            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-2">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="rgba(212, 167, 44, 0.2)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="#D4A72C"
                strokeWidth="6"
                fill="none"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </svg>

            <span className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tight">
              {count}
            </span>
            <span className="text-xs font-mono text-[#D4A72C] mt-1 font-semibold">
              sur {selectedPreset.target}
            </span>
            <span className="text-[10px] uppercase font-mono text-white/70 mt-3 px-3 py-1 bg-white/10 rounded-full">
              Touchez pour réciter
            </span>
          </button>
        </div>

        {/* Completion & Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 px-2 sm:px-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
            <Award className="w-4 h-4 text-[#D4A72C]" />
            <span>Tours achevés : <strong className="text-[#072B21]">{completedRounds}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic(10);
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
              title={soundEnabled ? 'Désactiver le son et les vibrations' : 'Activer le son et les vibrations'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Remettre à zéro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Merits Footer Note */}
        <div className="bg-[#FAFBFB] rounded-xl p-3 border border-gray-100 text-left flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 text-[#D4A72C] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#072B21] font-medium">Mérite doctrinal :</strong> {selectedPreset.merits}
          </p>
        </div>

      </div>

      {/* Daily Wird Routine Tracker Accordion */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <button
          onClick={() => {
            triggerHaptic(10);
            setShowWirdChecklist(!showWirdChecklist);
          }}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors touch-manipulation"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E4D3C]/10 text-[#0E4D3C] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#072B21]">
                Suivi du Wird Quotidien
              </h4>
              <p className="text-[11px] text-gray-500 font-sans">
                Cochez vos oraisons quotidiennes prescrites par la Tariqa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0E4D3C] bg-emerald-50 px-2 py-0.5 rounded-full">
              {dailyWirds.filter((w) => w.done).length} / {dailyWirds.length}
            </span>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showWirdChecklist ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {showWirdChecklist && (
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
            {dailyWirds.map((wird) => (
              <button
                key={wird.id}
                onClick={() => toggleWird(wird.id)}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all touch-manipulation ${
                  wird.done
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-[#F9FAF9] border-gray-200 text-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xs">
                      {wird.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      • {wird.time}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 font-sans">
                    {wird.formula}
                  </p>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  wird.done ? 'bg-emerald-600 text-white' : 'border-2 border-gray-300 bg-white'
                }`}>
                  {wird.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
