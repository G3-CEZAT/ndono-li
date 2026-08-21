import React, { useState, useRef, useEffect } from 'react';
import { PILGRIM_CHAT_SAMPLES, PilgrimChatSample } from '../../data/pilgrimHomeData';
import { triggerHaptic, speakText, stopSpeech } from '../../utils/audioFeedback';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Share2,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface HadaraChatViewProps {
  initialTopic?: string;
}

export const HadaraChatView: React.FC<HadaraChatViewProps> = ({ initialTopic }) => {
  const [messages, setMessages] = useState<PilgrimChatSample[]>(PILGRIM_CHAT_SAMPLES);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({
    'sample-01': true,
    'sample-02': false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Tous', 
    'Oraisons & Pratiques', 
    'Doctrine & Histoire', 
    'Gamou & Mawlid', 
    'Adab & Pèlerinage'
  ];

  const suggestedPrompts = [
    'Quelles sont les conditions du Lâzim ?',
    'Date de naissance et vie de Maodo ?',
    'Thème officiel du Gamou 2026 ?',
    'Mérites de la Salât al-Fâtih ?',
    'Adab de la Ziyâra à Tivaouane ?',
    'Accomplir la Wadhîfa selon Maodo ?',
  ];

  useEffect(() => {
    if (initialTopic) {
      handleSend(`Pouvez-vous m'expliquer l'enseignement doctrinal de : ${initialTopic} ?`);
    }
  }, [initialTopic]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    triggerHaptic(15);
    setInputQuery('');
    setIsGenerating(true);

    // Simulate RAG retrieval with authentic texts of Seydi El Hadji Malick Sy (RTA)
    setTimeout(() => {
      const lower = q.toLowerCase();
      const existingMatch = PILGRIM_CHAT_SAMPLES.find(
        (s) => s.question.toLowerCase().includes(lower.substring(0, 12)) ||
               lower.includes(s.category.toLowerCase().substring(0, 5))
      );

      let newAnswer: PilgrimChatSample;

      if (existingMatch && !textToSend) {
        newAnswer = {
          ...existingMatch,
          id: `resp-${Date.now()}`,
          question: q,
        };
      } else {
        newAnswer = {
          id: `rag-${Date.now()}`,
          question: q,
          category: q.includes('Gamou') ? 'Gamou & Mawlid' : q.includes('Ziyâra') ? 'Adab & Pèlerinage' : 'Doctrine & Histoire',
          answer: `Selon les enseignements consignés dans les traités fondamentaux de Seydi El Hadji Malick Sy (RTA) — notamment *Kifâyat ar-Râghibîn* et *Ifhâm al-Munkir* :\n\nL'engagement dans la Voie Tijâniyya repose sur l'harmonie parfaite entre la Loi révélée (Sharî'a) et la vérité spirituelle (Haqîqa). Seydi El Hadji Malick Sy rappelait sans cesse que l'élévation spirituelle ne peut être obtenue qu'à travers l'amour du Prophète Mouhammad (PSL), l'assiduité aux oraisons prescrites (Lâzim, Wadhîfa) et une conduite morale exemplaire envers l'ensemble des créatures.`,
          isCertified: false,
          theologicalNote: 'Réponse générée en temps réel à partir de la base vectorielle des écrits de Maodo. En cours d’arbitrage par le collège des érudits.',
          sources: [
            {
              bookTitle: 'Kifâyat ar-Râghibîn',
              pageOrBayt: 'Chapitre sur les Fondements Spirituels, p. 74',
              quoteArabic: 'ولا طريق إلى الله تعالى إلا باتباع رسوله صلى الله عليه وسلم ظاهرا وباطنا...',
              translationFr: "Il n'est d'autre voie vers Dieu que le suivi scrupuleux de Son Messager (PSL), tant dans l'apparence que dans le secret des cœurs.",
            },
            {
              bookTitle: 'Ifhâm al-Munkir al-Jânî',
              pageOrBayt: 'Section Éthique & Adab',
              translationFr: "La voie spirituelle est une discipline de pureté, de respect mutuel et de loyauté envers la communauté.",
            }
          ],
        };
      }

      setMessages((prev) => [...prev, newAnswer]);
      setExpandedSources((prev) => ({ ...prev, [newAnswer.id]: true }));
      setIsGenerating(false);

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    triggerHaptic(10);
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleAudio = (id: string, text: string) => {
    triggerHaptic(10);
    if (activeAudioId === id) {
      stopSpeech();
      setActiveAudioId(null);
    } else {
      setActiveAudioId(id);
      speakText(text, () => setActiveAudioId(null));
    }
  };

  const toggleSource = (id: string) => {
    triggerHaptic(10);
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredMessages = selectedCategory === 'Tous'
    ? messages
    : messages.filter((m) => m.category === selectedCategory);

  return (
    <div id="hadara-chat-section" className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-3">
      
      {/* Category Pills (Touch Swipeable) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs touch-pan-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              triggerHaptic(10);
              setSelectedCategory(cat);
            }}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap min-h-[38px] transition-all touch-manipulation active:scale-95 ${
              selectedCategory === cat
                ? 'bg-[#0E4D3C] text-white shadow-xs font-semibold'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Conversation Stream */}
      <div className="space-y-4">
        
        {/* Welcome Banner if empty */}
        {filteredMessages.length === 0 && (
          <div className="bg-white rounded-3xl p-6 text-center border border-gray-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0E4D3C]/10 text-[#0E4D3C] flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-base">
              Médiation Doctrinale Hadara IA
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              Posez vos questions sur la Tariqa Tijaniyya, les écrits de Maodo ou le Gamou de Tivaouane.
            </p>
          </div>
        )}

        {/* Message Stream */}
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="space-y-3 animate-in fade-in duration-200">
            
            {/* User Message Bubble */}
            <div className="flex items-start justify-end gap-2 pl-6">
              <div className="bg-[#072B21] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs max-w-[88%] border border-[#0E4D3C]">
                <div className="text-[10px] font-mono text-[#D4A72C] font-semibold mb-0.5">
                  Question
                </div>
                <p className="text-sm font-sans font-normal leading-relaxed">
                  {msg.question}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 shadow-2xs">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* AI Assistant Answer Card */}
            <div className="flex items-start gap-2 pr-2">
              <div className="w-8 h-8 rounded-xl bg-[#D4A72C] text-[#072B21] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>

              <div className="bg-white rounded-2xl rounded-tl-xs p-4 sm:p-5 flex-1 border border-gray-200 shadow-sm space-y-3 text-gray-800">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {msg.isCertified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Certifié Zawiya
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        RAG IA • En arbitrage
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-gray-400">
                      {msg.category}
                    </span>
                  </div>

                  {/* Actions: Audio recitation & Copy */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleAudio(msg.id, msg.answer)}
                      className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-all touch-manipulation ${
                        activeAudioId === msg.id 
                          ? 'bg-[#0E4D3C] text-[#D4A72C]' 
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={activeAudioId === msg.id ? 'Arrêter la lecture vocale' : 'Écouter la réponse'}
                    >
                      {activeAudioId === msg.id ? (
                        <VolumeX className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.answer, msg.id)}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all touch-manipulation"
                      title="Copier le texte"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Audio Playing Indicator */}
                {activeAudioId === msg.id && (
                  <div className="p-2 rounded-xl bg-[#072B21] text-[#E8C158] text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Lecture vocale doctrinale active...</span>
                    </div>
                    <button 
                      onClick={() => {
                        stopSpeech();
                        setActiveAudioId(null);
                      }}
                      className="text-white/80 hover:text-white text-xs font-mono underline"
                    >
                      Arrêter
                    </button>
                  </div>
                )}

                {/* Text Content */}
                <div className="text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-line font-sans">
                  {msg.answer}
                </div>

                {/* Verified Sources Toggle */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bg-[#F8FAF9] rounded-xl border border-gray-200/90 overflow-hidden">
                    <button
                      onClick={() => toggleSource(msg.id)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-[#0E4D3C] hover:bg-gray-50 transition-colors touch-manipulation min-h-[40px]"
                    >
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
                        <span>Sources authentifiées ({msg.sources.length})</span>
                      </div>
                      {expandedSources[msg.id] ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-gray-100 text-xs">
                        {msg.sources.map((src, i) => (
                          <div key={i} className="pl-2.5 border-l-2 border-[#D4A72C] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#072B21] font-serif">
                                {src.bookTitle}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {src.pageOrBayt}
                              </span>
                            </div>

                            {src.quoteArabic && (
                              <p className="text-xs text-[#072B21] font-serif leading-relaxed py-0.5" dir="rtl">
                                {src.quoteArabic}
                              </p>
                            )}

                            <p className="text-xs text-gray-600 italic">
                              « {src.translationFr} »
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Theological Note */}
                {msg.theologicalNote && (
                  <div className="text-[11px] text-gray-500 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100 font-sans">
                    <strong className="text-amber-900 font-serif">Note doctrinale :</strong> {msg.theologicalNote}
                  </div>
                )}

                {/* Follow-up Question Chips */}
                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">
                    Approfondir :
                  </span>
                  <button
                    onClick={() => handleSend(`Quels sont les bienfaits et mérites mentionnés dans ${msg.sources?.[0]?.bookTitle || 'les écrits de Maodo'} ?`)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0E4D3C] bg-[#F4F6F5] hover:bg-[#0E4D3C]/10 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span>Bienfaits & Mérites</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleSend("Comment appliquer cet enseignement au quotidien selon la Tariqa ?")}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0E4D3C] bg-[#F4F6F5] hover:bg-[#0E4D3C]/10 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span>Pratique au quotidien</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        ))}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 max-w-md animate-pulse">
            <div className="w-6 h-6 rounded-full bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center text-xs font-bold animate-spin">
              ⚡
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#0E4D3C]">
                Recherche dans les manuscrits de Maodo...
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                Indexation vectorielle RAG & certification doctrinale
              </p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Fast Tap Prompts */}
      <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span className="font-bold text-[#072B21]">Questions fréquentes</span>
          <span className="text-[10px] text-gray-400">Touchez pour poser</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 touch-pan-x">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#F4F6F5] hover:bg-[#0E4D3C] hover:text-white border border-gray-200/80 text-xs text-gray-700 font-medium whitespace-nowrap transition-all touch-manipulation active:scale-95 flex-shrink-0 min-h-[36px] flex items-center"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Message Input Form */}
      <div className="sticky bottom-16 md:bottom-0 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-gray-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 bg-[#F4F6F5] rounded-xl p-1 border border-gray-300 focus-within:border-[#0E4D3C] focus-within:bg-white transition-all shadow-inner"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Posez une question doctrinale ou spirituelle..."
            className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 focus:outline-none placeholder:text-gray-400 font-sans"
          />

          <button
            type="button"
            onClick={() => handleSend("Quelles sont les recommandations de Maodo pour la nuit du Gamou ?")}
            className="p-2 text-gray-400 hover:text-[#0E4D3C] rounded-lg hover:bg-gray-200 transition-colors touch-manipulation"
            title="Suggestion rapide"
          >
            <Sparkles className="w-4 h-4 text-[#D4A72C]" />
          </button>

          <button
            type="submit"
            disabled={isGenerating || !inputQuery.trim()}
            className="px-4 py-2.5 bg-[#0E4D3C] hover:bg-[#155e4b] disabled:opacity-40 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all touch-manipulation active:scale-95 min-h-[40px]"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5 text-[#D4A72C]" />
          </button>
        </form>
      </div>

    </div>
  );
};
