import React from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { PilgrimTab } from './PilgrimNavbar';
import { 
  ShieldCheck, 
  BookOpen, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Sparkles,
  Flame,
  Library,
  CheckCircle2
} from 'lucide-react';

interface PilgrimFooterProps {
  setActiveTab: (tab: PilgrimTab) => void;
  onOpenAdmin?: () => void;
}

export const PilgrimFooter: React.FC<PilgrimFooterProps> = ({
  setActiveTab,
}) => {
  return (
    <footer className="bg-[#072B21] text-white border-t-2 border-[#D4A72C]/40 pt-12 pb-20 lg:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Sceau */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-[#D4A72C] to-[#1A6B54]">
                <div className="w-full h-full rounded-[14px] bg-[#0E4D3C] overflow-hidden flex items-center justify-center">
                  <img src={zawiyaLogo} alt="Logo Zawiya" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white">
                  Hadara Tidiane
                </h4>
                <p className="text-xs text-[#D4A72C] font-serif">
                  Zawiya de Tivaouane
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Plateforme spirituelle et culturelle dédiée aux pèlerins et disciples, adossée au corpus authentique de Seydi El Hadji Malick Sy (RTA).
            </p>

            <div className="flex items-center gap-2 text-xs text-[#E8C158]">
              <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Tivaouane, Région de Thiès, Sénégal</span>
            </div>
          </div>

          {/* Navigation Pèlerin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A72C] font-mono">
              Parcours Pèlerin
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => { setActiveTab('home'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Accueil & Présentation
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('biography'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Biographie de Maodo (v.1855–1922)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('hadara'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Les 4 Piliers Fondateurs
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('gamou'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Gamou 2026 (124e édition — Tawhîd)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('tasbih'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] text-[#E8C158] transition-colors flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D4A72C]" />
                  <span>• Tasbîh & Guide des Oraisons</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Doctrines & Savoirs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A72C] font-mono">
              Doctrines & Savoirs
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => { setActiveTab('chatbot'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] text-[#E8C158] font-semibold transition-colors flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-[#D4A72C]" />
                  <span>Hadara IA — Assistant Pèlerin</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('library'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Bibliothèque des Traités de Maodo
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('videos'); window.scrollTo(0,0); }} className="hover:text-[#E8C158] transition-colors">
                  • Médiathèque & Histoire de Tivaouane
                </button>
              </li>
              <li>
                <span className="text-[11px] text-white/50">
                  • Sources : Kifâyat ar-Râghibîn, Khilâs az-Zahab, Ifhâm al-Munkir
                </span>
              </li>
            </ul>
          </div>

          {/* Comité Scientifique & Rigueur */}
          <div className="space-y-3 bg-[#0E4D3C] p-4 rounded-2xl border border-[#D4A72C]/40">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E8C158]">
              <ShieldCheck className="w-4 h-4 text-[#D4A72C]" />
              <span>Comité Scientifique & Rigueur</span>
            </div>
            <p className="text-[11px] text-white/75 leading-relaxed">
              Toutes les réponses doctrinales sont indexées sur les écrits authentiques et validées sous la supervision de la Zawiya de Tivaouane.
            </p>
            <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 text-[10px] text-[#E8C158] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A72C] flex-shrink-0" />
              <span>Conforme au rite malikite et aux convenances de la Tariqa</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Hadara Tidiane de Tivaouane — Cellule Zawiya Tijaniyya (CEZAT).
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fidélité Doctrinale & Textuelle</span>
            <span>•</span>
            <span>Éthique Islamique & Confraternelle</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

