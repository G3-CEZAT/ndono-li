import React, { useState } from 'react';
import { TASBIH_FORMULAS, TasbihFormula } from '../../data/mobileSpiritualData';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Check, 
  Vibrate, 
  Heart,
  BookOpen
} from 'lucide-react';

export const MobileTasbihView: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<TasbihFormula>(TASBIH_FORMULAS[0]);
  const [count, setCount] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(selectedFormula.defaultTarget);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [vibrateOn, setVibrateOn] = useState<boolean>(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Daily Wird Tracker Checklist State
  const [wirdTracker, setWirdTracker] = useState({
    lazimMatin: false,
    lazimSoir: false,
    wadhifaSoir: false,
    haylalaVendredi: false,
  });

  const handleBeadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Increment count
    setCount((prev) => {
      const next = prev + 1;
      if (next === targetCount && vibrateOn && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      return next;
    });

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev.slice(-4), { id: Date.now(), x, y }]);
  };

  const handleSelectFormula = (f: TasbihFormula) => {
    setSelectedFormula(f);
    setTargetCount(f.defaultTarget);
    setCount(0);
  };

  const handleReset = () => {
    setCount(0);
  };

  const progressPercent = Math.min(100, Math.round((count / (targetCount || 1)) * 100));

  return (
    <div id="mobile-tasbih-view" className="space-y-6 pb-24 text-[#1A1A1A]">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white p-5 rounded-3xl border border-[#D4A72C]/40 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono">
              Tasbîh & Oraisons
            </span>
            <span className="text-xs text-[#E8C158] font-mono">Wird Tijâniyya</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setVibrateOn(!vibrateOn)}
              className={`p-1.5 rounded-lg border text-xs ${
                vibrateOn ? 'bg-[#D4A72C] text-[#0E4D3C] border-[#D4A72C]' : 'bg-white/10 text-white/60 border-white/20'
              }`}
              title="Vibration"
            >
              <Vibrate className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={`p-1.5 rounded-lg border text-xs ${
                isSoundOn ? 'bg-[#D4A72C] text-[#0E4D3C] border-[#D4A72C]' : 'bg-white/10 text-white/60 border-white/20'
              }`}
              title="Sonorisation"
            >
              {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-white">
            Chapelet Numérique & Compteur
          </h2>
          <p className="text-xs text-white/80 leading-snug pt-0.5">
            Accompagnement pour l'accomplissement du Lâzim, de la Wadhîfa et des Salawât sur le Prophète (PSL).
          </p>
        </div>
      </div>

      {/* Formula Selector Horizontal Pill Bar */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase font-mono text-gray-500 flex items-center justify-between px-1">
          <span>Choisir la formule de Zikr :</span>
          <span className="text-[#0E4D3C] font-serif">{selectedFormula.category}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TASBIH_FORMULAS.map((formula) => {
            const isSelected = selectedFormula.id === formula.id;
            return (
              <button
                key={formula.id}
                onClick={() => handleSelectFormula(formula)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#0E4D3C] text-white border-2 border-[#D4A72C] shadow-md scale-102'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{formula.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#D4A72C] text-[#0E4D3C]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {formula.defaultTarget}x
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Formula Card & Arabic Text */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="text-right font-serif text-base sm:text-lg text-[#0E4D3C] leading-relaxed" dir="rtl">
          {selectedFormula.arabic}
        </div>
        
        <div className="text-xs text-gray-600 italic font-mono bg-[#F4F6F5] p-3 rounded-2xl border border-gray-100">
          « {selectedFormula.translation} »
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 font-sans border-t border-gray-100 pt-2">
          <span className="text-[#0E4D3C] font-semibold">💡 Vertu : {selectedFormula.virtue}</span>
        </div>
      </div>

      {/* Main Interactive Tasbih Counter Button */}
      <div className="bg-gradient-to-b from-[#F9FAF9] to-white rounded-3xl p-6 border-2 border-[#0E4D3C]/20 shadow-md flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        
        {/* Top Counter Header */}
        <div className="flex items-center justify-between w-full max-w-xs px-2">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-mono uppercase">Objectif</span>
            <div className="flex items-center gap-1">
              {[33, 100, 500, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => setTargetCount(t)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    targetCount === t
                      ? 'bg-[#0E4D3C] text-white border-[#0E4D3C] font-bold'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center gap-1 text-xs transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">Reset</span>
          </button>
        </div>

        {/* Large Circular Tap Bead */}
        <div className="relative flex items-center justify-center">
          {/* Circular Progress Ring */}
          <svg className="w-56 h-56 transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="#E5E7EB"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="#D4A72C"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 98}
              strokeDashoffset={2 * Math.PI * 98 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-200"
            />
          </svg>

          {/* Center Touch Button */}
          <button
            id="mobile-tasbih-tap-button"
            onClick={handleBeadClick}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform overflow-hidden group cursor-pointer border-4 border-[#D4A72C]/40"
          >
            {/* Ripples */}
            {ripples.map((r) => (
              <span
                key={r.id}
                style={{ top: r.y - 40, left: r.x - 40 }}
                className="absolute w-20 h-20 bg-[#D4A72C]/30 rounded-full animate-ping pointer-events-none"
              />
            ))}

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4A72C]">
              {selectedFormula.name.split(' ')[0]}
            </span>

            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white my-1 tracking-tight">
              {count}
            </span>

            <span className="text-xs text-[#E8C158] font-mono">
              sur {targetCount} ({progressPercent}%)
            </span>

            <span className="text-[9px] text-white/50 mt-1 uppercase font-mono tracking-wider">
              Toucher pour compter
            </span>
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCount((prev) => prev + 10)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 font-semibold"
          >
            +10
          </button>
          <button
            onClick={() => setCount((prev) => prev + 33)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 font-semibold"
          >
            +33
          </button>
          <button
            onClick={() => setCount((prev) => prev + 100)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 font-semibold"
          >
            +100
          </button>
        </div>
      </div>

      {/* Daily Wird & Oraisons Checklist Tracker */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0E4D3C]" />
            <h3 className="font-serif font-bold text-sm text-[#0E4D3C]">
              Suivi Quotidien des Devoirs Spirituels
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#D4A72C] font-bold">
            Aujourd'hui
          </span>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'lazimMatin' as const,
              title: 'Lâzim du Matin',
              subtitle: '100 Istighfâr • 100 Salât al-Fâtih • 100 Haylala',
              time: 'Après Subh / Matinée',
            },
            {
              id: 'lazimSoir' as const,
              title: 'Lâzim du Soir',
              subtitle: '100 Istighfâr • 100 Salât al-Fâtih • 100 Haylala',
              time: 'Après ‘Asr jusqu’à la nuit',
            },
            {
              id: 'wadhifaSoir' as const,
              title: 'Wadhîfa Quotidienne (Collective)',
              subtitle: '30 Istighfâr • 50 Salât al-Fâtih • 100 Haylala • 12 Jawhara',
              time: 'À la Zawiya / Soirée',
            },
            {
              id: 'haylalaVendredi' as const,
              title: 'Haylala du Vendredi (‘Asr)',
              subtitle: 'Récitation collective exclusive du Tawhîd en assemblée',
              time: 'Vendredi de ‘Asr au Maghrib',
            },
          ].map((item) => {
            const isChecked = wirdTracker[item.id];
            return (
              <div
                key={item.id}
                onClick={() =>
                  setWirdTracker((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-[#F9FAF9] border-gray-200 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xs">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border text-gray-500">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {item.subtitle}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-[#0E4D3C] text-[#D4A72C]'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
