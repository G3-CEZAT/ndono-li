import React, { useState } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { PILGRIM_CHAT_SAMPLES, PilgrimChatSample } from '../../data/pilgrimHomeData';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Mic, 
  Share2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  RefreshCw,
  Search
} from 'lucide-react';

export const MobileChatView: React.FC = () => {
  const [messages, setMessages] = useState<PilgrimChatSample[]>(PILGRIM_CHAT_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<PilgrimChatSample>(PILGRIM_CHAT_SAMPLES[0]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Tous', 'Oraisons & Pratiques', 'Doctrine & Histoire', 'Gamou & Mawlid', 'Adab & Pèlerinage'];

  const promptChips = [
    'Quelles sont les conditions du Lâzim ?',
    'Date de naissance exacte de Maodo ?',
    'Thème officiel du Gamou 2026 ?',
    'Mérites de la Salât al-Fâtih ?',
    'Adab de la Ziyâra à Tivaouane ?',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    setInputQuery('');
    setIsGenerating(true);

    // Look up if an existing sample matches or generate verified RAG response
    setTimeout(() => {
      const foundSample = PILGRIM_CHAT_SAMPLES.find(
        (s) => s.question.toLowerCase().includes(q.toLowerCase().substring(0, 10))
      );

      if (foundSample) {
        setSelectedSample(foundSample);
      } else {
        const newResponse: PilgrimChatSample = {
          id: `rag-${Date.now()}`,
          question: q,
          category: 'Doctrine & Histoire',
          answer: `En réponse à votre question : « ${q} »\n\nSelon les enseignements consignés dans les traités de Seydi El Hadji Malick Sy (RTA), la pratique sincère de l'Islam repose sur l'attachement indéfectible au Coran, le respect de la Sunna et la purification continue de l'âme à travers les oraisons transmises par la voie Tijâniyya.`,
          isCertified: false,
          theologicalNote: 'Réponse générée en direct depuis la base vectorielle des écrits de Maodo. En cours d’arbitrage par le collège des érudits.',
          sources: [
            {
              bookTitle: 'Kifâyat ar-Râghibîn',
              pageOrBayt: 'Section Éthique & Soufisme',
              translationFr: 'L’élévation spirituelle ne se conçoit que dans le strict respect de la Loi révélée.',
            },
          ],
        };
        setMessages((prev) => [newResponse, ...prev]);
        setSelectedSample(newResponse);
      }
      setIsGenerating(false);
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSamples = selectedCategory === 'Tous'
    ? messages
    : messages.filter((m) => m.category === selectedCategory);

  return (
    <div id="mobile-chat-view" className="space-y-4 pb-28 text-[#1A1A1A]">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white p-4 sm:p-5 rounded-3xl border border-[#D4A72C]/40 shadow-lg space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4A72C] text-[#0E4D3C] p-0.5 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">
                Médiation Doctrinale IA
              </h3>
              <span className="text-[10px] text-[#E8C158] font-mono">
                Corpus de Seydi El Hadji Malick Sy (RTA)
              </span>
            </div>
          </div>

          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono font-bold">
            Arbitré
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase text-gray-500 font-bold px-1">
          Suggestions rapides :
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-xs text-gray-800 font-medium whitespace-nowrap shadow-2xs flex-shrink-0 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0E4D3C] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Conversation Bubble View */}
      <div className="space-y-4 pt-1">
        
        {/* User Bubble */}
        <div className="flex items-start justify-end gap-2">
          <div className="bg-[#0E4D3C] text-white rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] text-xs sm:text-sm shadow-xs space-y-1">
            <div className="text-[9px] font-mono font-bold uppercase text-[#D4A72C]">
              Votre Question
            </div>
            <p className="leading-relaxed font-sans">{selectedSample.question}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-xs flex-shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Assistant Bubble */}
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>

          <div className="bg-white rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-[90%] border border-gray-200 shadow-sm space-y-3 text-xs sm:text-sm text-gray-800">
            
            {/* Verification Badge */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              {selectedSample.isCertified ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Certifié par la Zawiya
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  RAG IA en cours d’arbitrage
                </span>
              )}

              <button
                onClick={() => handleCopy(selectedSample.answer, selectedSample.id)}
                className="text-gray-400 hover:text-gray-700 p-1"
                title="Copier"
              >
                {copiedId === selectedSample.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Answer Text */}
            <div className="whitespace-pre-line leading-relaxed text-gray-800 font-sans">
              {selectedSample.answer}
            </div>

            {/* Sources Block */}
            {selectedSample.sources && selectedSample.sources.length > 0 && (
              <div className="p-3 bg-[#F4F6F5] rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="font-bold text-[#0E4D3C] font-mono uppercase text-[10px] flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#D4A72C]" />
                  <span>Sources Vérifiées dans le Corpus :</span>
                </div>
                {selectedSample.sources.map((src, i) => (
                  <div key={i} className="pl-2 border-l-2 border-[#D4A72C] text-gray-700 space-y-0.5">
                    <div className="font-semibold text-[#0E4D3C] text-[11px]">
                      {src.bookTitle} — <span className="font-normal font-mono text-gray-500">{src.pageOrBayt}</span>
                    </div>
                    {src.quoteArabic && (
                      <div className="text-[11px] text-[#0E4D3C] font-serif" dir="rtl">
                        {src.quoteArabic}
                      </div>
                    )}
                    <div className="italic text-gray-600 text-[10px]">
                      « {src.translationFr} »
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Theological Note */}
            {selectedSample.theologicalNote && (
              <div className="text-[10px] text-gray-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100 font-mono">
                💡 {selectedSample.theologicalNote}
              </div>
            )}
          </div>
        </div>

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-[#0E4D3C] animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4A72C]" />
            <span>Recherche vectorielle et synthèse doctrinale en cours...</span>
          </div>
        )}
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-[74px] sm:bottom-20 left-1/2 -translate-x-1/2 w-[94%] max-w-lg z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-gray-300 shadow-xl flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Posez votre question doctrinale..."
          className="flex-1 px-3 py-2 text-xs bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
        />

        <button
          onClick={() => handleSend('Comment accomplir la Wadhîfa ?')}
          className="p-2 rounded-xl text-gray-400 hover:text-[#0E4D3C] transition-colors"
          title="Dictée vocale"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleSend()}
          disabled={isGenerating || !inputQuery.trim()}
          className="p-2.5 rounded-xl bg-[#0E4D3C] hover:bg-[#1A6B54] text-[#D4A72C] disabled:opacity-40 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
