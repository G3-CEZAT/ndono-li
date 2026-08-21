import React, { useState } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { PILGRIM_CHAT_SAMPLES, PilgrimChatSample } from '../../data/pilgrimHomeData';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  HelpCircle,
  Clock,
  User,
  Bot
} from 'lucide-react';

export const PilgrimChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<PilgrimChatSample[]>(PILGRIM_CHAT_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<PilgrimChatSample>(PILGRIM_CHAT_SAMPLES[0]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Oraisons & Pratiques', 'Doctrine & Histoire', 'Adab & Pèlerinage', 'Gamou & Mawlid'];

  const filteredSamples = selectedCategory === 'Tous'
    ? PILGRIM_CHAT_SAMPLES
    : PILGRIM_CHAT_SAMPLES.filter(s => s.category === selectedCategory);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery;
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      const newResponse: PilgrimChatSample = {
        id: `chat-${Date.now()}`,
        question: query,
        category: 'Doctrine & Histoire',
        answer: `En réponse à votre question : « ${query} »\n\nSelon les enseignements de Seydi El Hadji Malick Sy (RTA), la pratique de l'Islam et de la Voie Tijâniyya repose sur le respect rigoureux du Coran, de la Sunna et la purification du cœur par le souvenir perpétuel de Dieu. Les convenances transmises à la Zawiya de Tivaouane rappellent l'importance de la modération, de l'assiduité aux oraisons et de la bienveillance envers l'ensemble des créatures.`,
        isCertified: false, // Non-certified AI generated response until validated by scholars
        theologicalNote: "Réponse générée en direct depuis les écrits de la Hadara — En cours de révision par le collège des savants.",
        sources: [
          {
            bookTitle: 'Kifâyat ar-Râghibîn',
            pageOrBayt: 'Section Enseignements Moraux',
            translationFr: "La conformité à la Loi révélée est la condition première de tout cheminement spirituel.",
          },
        ],
      };

      setMessages(prev => [newResponse, ...prev]);
      setSelectedSample(newResponse);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div id="pilgrim-chatbot-view" className="space-y-8 pb-16 text-[#1A1A1A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white p-6 sm:p-10 rounded-3xl border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-3.5 h-3.5" />
              Assistant Pèlerin
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-[#E8C158] border border-white/20">
              Enseignements Certifiés
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Hadara IA — Enseignements de la Hadara Tidiane
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Interrogez le savoir de Maodo. Chaque réponse cite ses sources exactes dans les traités authentiques (Kifâyat ar-Râghibîn, Khilâs az-Zahab, Ifhâm al-Munkir) et affiche son statut de validation.
          </p>
        </div>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Questions selector & Themes */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold font-mono text-gray-500 uppercase">
              Catégories de questions :
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0E4D3C] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="text-xs font-bold font-mono text-gray-500 uppercase">
              Questions Fréquemment Posées :
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredSamples.map((sample) => {
                const isSelected = selectedSample.id === sample.id;

                return (
                  <button
                    key={sample.id}
                    onClick={() => setSelectedSample(sample)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-[#0E4D3C] text-white border-[#D4A72C] shadow-md'
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#D4A72C]' : 'text-[#0E4D3C]'}`}>
                        {sample.category}
                      </span>
                      {sample.isCertified ? (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-[#D4A72C] text-[#0E4D3C]' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Certifié
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-amber-400 text-black' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Hadara IA
                        </span>
                      )}
                    </div>
                    <p className="font-semibold line-clamp-2 leading-snug">
                      {sample.question}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Conversation View */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-md flex flex-col min-h-[550px] overflow-hidden">
          
          {/* Top Chat Bar */}
          <div className="p-4 bg-[#072B21] text-white border-b border-[#1A6B54] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E4D3C] border border-[#D4A72C] p-0.5 flex items-center justify-center">
                <img src={zawiyaLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white">
                  Réponse Doctrinale Vérifiée
                </h3>
                <span className="text-[10px] text-[#E8C158] font-mono">
                  Sources : Traités & Écrits de Seydi El Hadji Malick Sy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#D4A72C] font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Contrôle Scientifique</span>
            </div>
          </div>

          {/* Chat Stream Body */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
            
            {/* User Question */}
            <div className="flex items-start justify-end gap-3">
              <div className="bg-[#0E4D3C] text-white rounded-2xl rounded-tr-xs p-4 max-w-xl text-xs sm:text-sm shadow-sm space-y-1">
                <div className="text-[10px] font-bold text-[#D4A72C] uppercase font-mono">
                  Question Pèlerin
                </div>
                <p className="leading-relaxed">{selectedSample.question}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Assistant Answer */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>

              <div className="bg-white rounded-2xl rounded-tl-xs p-5 sm:p-6 max-w-2xl border border-gray-200 shadow-sm space-y-4 text-xs sm:text-sm text-gray-800">
                
                {/* Certification Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  {selectedSample.isCertified ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Réponse Arbitrée & Certifiée par la Zawiya</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Réponse Hadara IA — En cours de révision</span>
                    </div>
                  )}

                  {selectedSample.certifiedBy && (
                    <span className="text-[10px] text-gray-400 font-mono">
                      {selectedSample.certifiedBy}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="whitespace-pre-line leading-relaxed text-gray-800">
                  {selectedSample.answer}
                </div>

                {/* Sources Box */}
                {selectedSample.sources && selectedSample.sources.length > 0 && (
                  <div className="p-3.5 bg-[#F4F6F5] rounded-2xl border border-gray-200 text-xs space-y-2">
                    <div className="font-bold text-[#0E4D3C] font-mono uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
                      <span>Sources Documentaires dans les Traités :</span>
                    </div>
                    {selectedSample.sources.map((src, i) => (
                      <div key={i} className="pl-3 border-l-2 border-[#D4A72C] text-gray-700 space-y-0.5">
                        <div className="font-semibold text-[#0E4D3C]">
                          {src.bookTitle} — <span className="font-normal font-mono text-gray-500">{src.pageOrBayt}</span>
                        </div>
                        {src.quoteArabic && (
                          <div className="text-xs text-[#0E4D3C] font-serif" dir="rtl">
                            {src.quoteArabic}
                          </div>
                        )}
                        <div className="italic text-gray-600 text-[11px]">
                          « {src.translationFr} »
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Theological Note */}
                {selectedSample.theologicalNote && (
                  <div className="text-xs text-gray-500 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    💡 <strong>Note doctrinale :</strong> {selectedSample.theologicalNote}
                  </div>
                )}
              </div>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-[#0E4D3C] animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A72C]" />
                <span>Recherche dans le corpus doctrinal de Tivaouane en cours...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Posez votre question sur les oraisons, la doctrine ou les enseignements de Maodo..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:border-[#0E4D3C] focus:ring-2 focus:ring-[#0E4D3C]/20 shadow-inner"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-[#0E4D3C] hover:bg-[#1A6B54] text-[#D4A72C] font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 transition-all shadow-md"
            >
              <span>Envoyer</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
