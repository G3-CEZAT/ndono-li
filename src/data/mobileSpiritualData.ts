export interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  durationSec: number;
  imageBg: string; // Tailwind gradient or color
  arabicPhrase?: string;
  slides: {
    heading: string;
    text: string;
    subtext?: string;
    quote?: string;
  }[];
}

export interface HolyPlace {
  id: string;
  name: string;
  arabicName: string;
  category: 'Mausolée' | 'Zawiya' | 'Mosquée' | 'Cimetière' | 'Historique';
  distance: string;
  locationDescription: string;
  history: string;
  adab: string[];
  recommendedDua: string;
  audioGuideTitle?: string;
  audioGuideDuration?: string;
  visitingHours: string;
}

export interface AudioRecitation {
  id: string;
  title: string;
  arabicTitle: string;
  author: string;
  reciter: string;
  duration: string;
  description: string;
  verses: {
    number: number;
    arabic: string;
    phonetic: string;
    french: string;
  }[];
}

export interface TasbihFormula {
  id: string;
  name: string;
  arabic: string;
  phonetic: string;
  translation: string;
  defaultTarget: number;
  category: 'Lâzim' | 'Wadhîfa' | 'Salawât' | 'Tawhîd' | 'Noms Divins';
  virtue: string;
}

export const STORIES_DATA: StoryItem[] = [
  {
    id: 'story-maodo',
    title: 'Vie de Maodo',
    subtitle: '1855 - 1922',
    category: 'Histoire',
    durationSec: 6,
    imageBg: 'from-[#072B21] via-[#0E4D3C] to-[#D4A72C]',
    arabicPhrase: 'سيدي الحاج مالك سي رضي الله عنه',
    slides: [
      {
        heading: 'Une jeunesse vouée au Savoir',
        text: 'Né à Gaé dans le Walo, Seydi El Hadji Malick Sy mémorise le Coran dès son jeune âge avant de consacrer plus de 25 ans à voyager auprès des plus grands maîtres du Sénégal et de Mauritanie.',
        subtext: 'Maîtrise du Fiqh, Hadîth, Tafsîr et Tasawwuf.',
      },
      {
        heading: 'Le Pèlerinage de 1888',
        text: 'Son voyage à La Mecque et Médine scella son statut de grand pôle de la Tijâniyya, recevant les plus hautes autorisations (Ijâzât) spirituelles.',
        subtext: 'Une transmission ininterrompue jusqu’à Cheikh Ahmad Tijâni (RTA).',
      },
      {
        heading: 'L’ancrage à Tivaouane (1902)',
        text: 'En s’installant à Tivaouane, il transforma un carrefour du Cayor en phare de la spiritualité et fonda le premier Gamou public moderne.',
        quote: '« La paix sociale s’édifie par le savoir utile et le travail sanctifié. »',
      },
    ],
  },
  {
    id: 'story-gamou-1902',
    title: 'Gamou 1902',
    subtitle: 'Genèse du Mawlid',
    category: 'Tradition',
    durationSec: 6,
    imageBg: 'from-[#09372B] via-[#1A6B54] to-[#E8C158]',
    arabicPhrase: 'المولد النبوي الشريف بتيواوون',
    slides: [
      {
        heading: 'La première commémoration',
        text: 'En 1902, Seydi El Hadji Malick Sy réunit ses disciples pour chanter la naissance du Prophète (PSL) et partager le repas béni (Berndé).',
        subtext: 'L’ancêtre de la grande commémoration contemporaine.',
      },
      {
        heading: 'Récitation du Khilâs az-Zahab',
        text: 'Pendant toute la nuit sainte, les strophes du traité en vers composé par Maodo sont scandées avec ferveur par des milliers de voix.',
        quote: '« Célébrer la Miséricorde pour l’Univers, c’est raviver la foi des croyants. »',
      },
    ],
  },
  {
    id: 'story-salat-fatih',
    title: 'Salât al-Fâtih',
    subtitle: 'Prière de l’Ouverture',
    category: 'Oraisons',
    durationSec: 6,
    imageBg: 'from-[#0E4D3C] via-[#072B21] to-[#D4A72C]',
    arabicPhrase: 'صلاة الفاتح لما أغلق',
    slides: [
      {
        heading: 'La formule bénie',
        text: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ',
        subtext: 'Oraison quotidienne obligatoire dans le Wird de la Tijâniyya.',
      },
      {
        heading: 'Les vertus spirituelles',
        text: 'Seydi El Hadji Malick Sy a explicité dans Ifhâm al-Munkir les mérites incommensurables attachés à cette prière sur le Prophète (PSL).',
        quote: '« Que celui qui cherche l’ouverture du cœur s’attache avec constance à la Salât al-Fâtih. »',
      },
    ],
  },
  {
    id: 'story-zawiya',
    title: 'La Grande Zawiya',
    subtitle: 'Cœur battant',
    category: 'Lieux Saints',
    durationSec: 6,
    imageBg: 'from-[#072B21] via-[#0E4D3C] to-[#1A6B54]',
    arabicPhrase: 'الزاوية الأم بتيواوون',
    slides: [
      {
        heading: 'Le Foyer des Âmes',
        text: 'Édifiée par Maodo, la Zawiya Mère de Tivaouane accueille chaque soir la Wadhîfa communautaire et le vendredi après-midi la Haylala solennelle.',
        subtext: 'Un havre de paix et de purification.',
      },
      {
        heading: 'Rénovation & Splendeur',
        text: 'Aujourd’hui sublimée, la Grande Mosquée et la Zawiya constituent l’un des plus majestueux complexes islamiques d’Afrique.',
        quote: '« Les demeures de Dieu sur terre sont les mosquées. »',
      },
    ],
  },
  {
    id: 'story-piliers',
    title: '4 Piliers Hadara',
    subtitle: 'Doctrine sociale',
    category: 'Doctrine',
    durationSec: 6,
    imageBg: 'from-[#1A6B54] via-[#0E4D3C] to-[#D4A72C]',
    arabicPhrase: 'أركان الحضرة المالكية الأربعة',
    slides: [
      {
        heading: '1. Savoir & 2. Mosquées',
        text: 'At-Ta‘lîm : propagation universelle de la science coranique. Al-Masâjid : structuration de la vie spirituelle par les édifices sacrés.',
        subtext: 'L’élévation spirituelle par l’instruction.',
      },
      {
        heading: '3. Travail & 4. Gamou',
        text: 'Al-Filâha : autonomie matérielle par l’agriculture et l’effort. Al-Jam‘ : grand rassemblement annuel unificateur de la communauté.',
        quote: '« Dignité par le labeur, fraternité par la foi. »',
      },
    ],
  },
];

export const HOLY_PLACES: HolyPlace[] = [
  {
    id: 'place-01',
    name: 'Mausolée de Seydi El Hadji Malick Sy (RTA)',
    arabicName: 'روضة سيدي الحاج مالك سي',
    category: 'Mausolée',
    distance: '150 m du centre',
    locationDescription: 'Situé dans l’enceinte sacrée de la Grande Zawiya de Tivaouane.',
    history: 'Le repos éternel du fondateur de la Hadara Malikiyya (1855-1922). C’est le premier lieu de recueillement et de ferveur pour des millions de pèlerins venus du monde entier.',
    adab: [
      'Accomplir ses ablutions complètes avant d’entrer.',
      'Formuler une intention pure (Niyya) de Ziyâra.',
      'Baisser la voix et garder une posture de révérence et de recueillement.',
      'Réciter la Fâtiha et 11 Salât al-Fâtih pour l’âme du saint.',
    ],
    recommendedDua: 'اللَّهُمَّ اجْزِ شَيْخَنَا عَنَّا وَعَنِ الإِسْلامِ وَالمُسْلِمِينَ خَيْرَ الجَزَاءِ وَارْفَعْ دَرَجَتَهُ فِي أَعْلَى عِلِّيِّينَ',
    audioGuideTitle: 'Histoire & Adab de la Ziyâra de Maodo',
    audioGuideDuration: '4 min 12s',
    visitingHours: 'Ouvert 24h/24 lors du Gamou (Prière continue)',
  },
  {
    id: 'place-02',
    name: 'Mausolée de Serigne Babacar Sy (RTA)',
    arabicName: 'روضة خليفة رسول الله سيدي أبو بكر سي',
    category: 'Mausolée',
    distance: '300 m de la Zawiya',
    locationDescription: 'Situé dans son sanctuaire attenant à la Zawiya.',
    history: 'Premier Khalife général des Tidianes (1885-1957), fils aîné et successeur de Maodo. Initiateur des Dahiras (cellules de fidèles et d’entraide) et boussole de la jeunesse islamique.',
    adab: [
      'Observer le calme absolu dans le sanctuaire.',
      'Éviter toute bousculade près de la grille du mausolée.',
      'Multiplier les invocations pour la guidance de la jeunesse.',
    ],
    recommendedDua: 'رَبَّنَا اغْفِرْ لَهُ وَارْحَمْهُ وَاجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الجَنَّةِ',
    audioGuideTitle: 'Serigne Babacar Sy et la fondation des Dahiras',
    audioGuideDuration: '3 min 45s',
    visitingHours: '06h00 – 23h00',
  },
  {
    id: 'place-03',
    name: 'Mausolée de Serigne Abdoul Aziz Sy Dabakh (RTA)',
    arabicName: 'روضة سيدي عبد العزيز سي دباخ',
    category: 'Mausolée',
    distance: '250 m',
    locationDescription: 'Sanctuaire de recueillement à Tivaouane.',
    history: 'Troisième Khalife général (1904-1997), surnommé le « Régulateur social » et l’apôtre infatigable de la concorde nationale, de la paix et de la charité.',
    adab: [
      'Méditer sur son exemple de générosité et d’humilité.',
      'Invoquer la paix et la cohésion pour toute la nation sénégalaise et la Ummah.',
    ],
    recommendedDua: 'اللَّهُمَّ أَدِمْ نِعْمَةَ الأَمْنِ وَالسَّلامِ وَارْحَمْ وَالِدَنَا دَبَّاخْ',
    audioGuideTitle: 'Dabakh : L’apôtre de la paix et de l’humilité',
    audioGuideDuration: '5 min 10s',
    visitingHours: '06h00 – 00h00',
  },
  {
    id: 'place-04',
    name: 'La Grande Mosquée de Tivaouane',
    arabicName: 'المسجد الجامع بتيواوون',
    category: 'Mosquée',
    distance: 'Centre-ville',
    locationDescription: 'Monument architectural au cœur de la cité sainte.',
    history: 'Mosquée historique initiée par Maodo et magnifiée au fil des décennies. Récemment inaugurée dans sa version rénovée et agrandie pour accueillir des dizaines de milliers de fidèles.',
    adab: [
      'Prier deux rak‘ats de salutation de la mosquée (Tahiyyat al-Masjid).',
      'Assister aux cinq prières canoniques en congrégation.',
    ],
    recommendedDua: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    audioGuideTitle: 'Architecture sacrée de la Grande Mosquée',
    audioGuideDuration: '3 min 20s',
    visitingHours: 'Ouverte en permanence pour les 5 prières',
  },
  {
    id: 'place-05',
    name: 'Cimetière Sacré de Bakhiya',
    arabicName: 'مقبرة البقيع بتيواوون',
    category: 'Cimetière',
    distance: '800 m',
    locationDescription: 'Quartier Est de Tivaouane.',
    history: 'Le cimetière saint où reposent les grands muqaddams, compagnons intimes de Maodo, érudits et pieuses figures qui ont bâti le rayonnement de Tivaouane.',
    adab: [
      'Saluer les défunts selon la formule prophétique.',
      'Marcher avec décence sans marcher sur les tombes.',
      'Réciter la Fâtiha et offrir les mérites aux âmes saintes.',
    ],
    recommendedDua: 'السَّلامُ عَلَيْكُمْ دَارَ قَوْمٍ مُؤْمِنِينَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لاحِقُونَ',
    audioGuideTitle: 'Les compagnons de Maodo reposant à Bakhiya',
    audioGuideDuration: '4 min 50s',
    visitingHours: 'Du lever au coucher du soleil',
  },
];

export const AUDIO_RECITATIONS: AudioRecitation[] = [
  {
    id: 'audio-khilas-01',
    title: 'Khilâs az-Zahab — Chants de la Nativité',
    arabicTitle: 'خلاص الذهب في سيرة خير العرب',
    author: 'Seydi El Hadji Malick Sy (RTA)',
    reciter: 'Chœur officiel de la Zawiya de Tivaouane',
    duration: '4:35',
    description: 'Les vers les plus célèbres célébrant la naissance et la généalogie sainte du Prophète Mouhammad (PSL).',
    verses: [
      {
        number: 1,
        arabic: 'بِسْمِ الإِلَهِ خَيْرِ مَنْ تَبَدَّا • وَحَمْدِهِ وَالشُّكْرِ لَيْسَ يُعْدَى',
        phonetic: "Bismi-l-Ilâhi khayri man tabaddâ • Wa hamdihî wash-shukru laysa yu'dâ",
        french: "Au Nom de Dieu, le Meilleur par qui commencer • À Lui la louange et le remerciement infini.",
      },
      {
        number: 2,
        arabic: 'ثُمَّ صَلَاةُ رَبِّنَا وَسَلَامْ • عَلَى النَّبِيِّ سَيِّدِ الأَنَامْ',
        phonetic: "Thumma salâtu Rabbinâ wa salâm • 'Alâ-n-Nabiyyi Sayyidi-l-anâm",
        french: "Puis la prière de notre Seigneur et Son salut • Sur le Prophète, le Maître des créatures.",
      },
      {
        number: 3,
        arabic: 'مُحَمَّدٍ خَيْرِ الْوَرَى وَأَزْكَى • وَمَنْ لِعَرْشِ رَبِّهِ قَدْ رَقَى',
        phonetic: "Mouhammadin khayri-l-warâ wa azkâ • Wa man li-'arshi Rabbihî qad raqâ",
        french: "Mouhammad, la plus pure et la meilleure des créatures • Celui qui s’éleva jusqu’au Trône divin.",
      },
      {
        number: 4,
        arabic: 'وُلِدَ خَيْرُ مَنْ رَأَتْهُ عَيْنُ • فَاسْتَبْشَرَ الْكَوْنُ وَزَالَ الغَيْنُ',
        phonetic: "Wulida khayru man ra'athu 'aynu • Fastabshara-l-kawnu wa zâla-l-ghaynu",
        french: "Est né le meilleur être que l’œil ait jamais contemplé • L’Univers s’en est réjoui et les ténèbres se sont dissipées.",
      },
    ],
  },
  {
    id: 'audio-jaliyat-01',
    title: 'Jâliyat al-Karab — Dissipatrice des Angoisses',
    arabicTitle: 'جالية الكرب بأصحاب سيد العجم والعرب',
    author: 'Seydi El Hadji Malick Sy (RTA)',
    reciter: 'Dahira des Érudits de Tivaouane',
    duration: '5:12',
    description: 'Tawassul poétique par les compagnons de Badr et les nobles vertus de la famille prophétique.',
    verses: [
      {
        number: 1,
        arabic: 'يَا رَبِّ بِالمُصْطَفَى بَلِّغْ مَقَاصِدَنَا • وَاغْفِرْ لَنَا مَا مَضَى يَا وَاسِعَ الكَرَمِ',
        phonetic: "Yâ Rabbi bil-Mustafâ balligh maqâsidanâ • Waghfir lanâ mâ madâ yâ Wâsi'al-Karami",
        french: "Ô Seigneur, par l'Élu exauce nos desseins • Et pardonne notre passé, Ô Généreux sans limite.",
      },
      {
        number: 2,
        arabic: 'وَبِالصَّحَابَةِ الْكِرَامِ الأَبْرَارْ • نَجِّ الْعِبَادَ مِنْ عَذَابِ النَّارْ',
        phonetic: "Wa bis-sahâbati-l-kirâmi-l-abrâr • Najji-l-'ibâda min 'adhâbi-n-Nâr",
        french: "Et par les nobles et vertueux Compagnons • Sauve les serviteurs du châtiment du Feu.",
      },
    ],
  },
];

export const TASBIH_FORMULAS: TasbihFormula[] = [
  {
    id: 'f-salat-fatih',
    name: 'Salât al-Fâtih',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ',
    phonetic: 'Allâhumma salli ‘alâ Sayyidinâ Muhammadin al-fâtihi limâ ughliqa, wal-khâtimi limâ sabaqa, nâsiri-l-haqqi bil-haqqi, wal-hâdî ilâ sirâtika-l-mustaqîm, wa ‘alâ âlihî haqqa qadrihî wa miqdârihi-l-‘azîm.',
    translation: 'Ô Seigneur ! Prie sur notre seigneur Mouhammad, qui a ouvert ce qui était clos, qui a clos ce qui a précédé, le défenseur de la vérité par la vérité et le guide vers Ton droit chemin, ainsi que sur sa sainte famille à la hauteur de son rang immense.',
    defaultTarget: 100,
    category: 'Salawât',
    virtue: 'Cœur du Wird Tijâniyya, source d’illumination et de protection divine.',
  },
  {
    id: 'f-istighfar',
    name: 'Astaghfirullâh al-‘Azîm',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    phonetic: 'Astaghfirullâha-l-‘Azîm alladhî lâ ilâha illâ Huwa-l-Hayyu-l-Qayyûmu wa atûbu ilayh.',
    translation: 'Je demande pardon à Allah l’Immense, en dehors de Qui il n’y a point de divinité, le Vivant, l’Absolu, et je me repens à Lui.',
    defaultTarget: 100,
    category: 'Lâzim',
    virtue: 'Purification des cœurs et absolution des péchés.',
  },
  {
    id: 'f-tawhid',
    name: 'Lâ ilâha illa Allâh (Tawhîd)',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    phonetic: 'Lâ ilâha illa Allâh',
    translation: 'Il n’y a de divinité digne d’adoration qu’Allah.',
    defaultTarget: 100,
    category: 'Tawhîd',
    virtue: 'La meilleure parole prononcée par les prophètes, ancre de la foi.',
  },
  {
    id: 'f-jawhara',
    name: 'Jawharat al-Kamâl (La Perle de la Perfection)',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ وَالْيَاقُوتَةِ الْمُتَحَقِّقَةِ الْحَائِطَةِ بِمَرْكَزِ الْفُهُومِ وَالْمَعَانِي...',
    phonetic: 'Allâhumma salli wa sallim ‘alâ ‘ayni-r-rahmati-r-rabbâniyyati wal-yâqûtati-l-mutahaqqiqati...',
    translation: 'Oraison suprême de la Wadhîfa récitée 12 fois dans un état de pureté rituelle à l’eau.',
    defaultTarget: 12,
    category: 'Wadhîfa',
    virtue: 'Présence spirituelle bénie et illumination des cœurs.',
  },
  {
    id: 'f-latif',
    name: 'Yâ Latîf (Ô Bienveillant / Le Subtil)',
    arabic: 'يَا لَطِيفُ',
    phonetic: 'Yâ Latîf',
    translation: 'Ô Toi l’Infiniment Doux et Bienveillant envers Ses créatures.',
    defaultTarget: 129,
    category: 'Noms Divins',
    virtue: 'Dissipation des épreuves et apaisement des tourments.',
  },
];

export const DAILY_PRAYER_TIMES_TIVAOUANE = {
  city: 'Tivaouane, Sénégal',
  hijriDate: "12 Rabî' al-Awwal 1448 H",
  gregorianDate: 'Aujourd’hui',
  prayers: [
    { name: 'Fajr (Subh)', arabic: 'الفجر', time: '05:32', passed: true },
    { name: 'Shurûq (Lever)', arabic: 'الشروق', time: '06:50', passed: true },
    { name: 'Dhuhr (Tisbar)', arabic: 'الظهر', time: '13:10', passed: true },
    { name: 'Asr (Takusân)', arabic: 'العصر', time: '16:35', passed: false, current: true },
    { name: 'Maghrib (Timis)', arabic: 'المغرب', time: '19:22', passed: false },
    { name: 'Isha (Geewe)', arabic: 'العشاء', time: '20:34', passed: false },
  ],
  nextHadaraWadhifa: 'Wadhîfa du soir à la Grande Zawiya : 17h15',
  gamouCountdownDays: 14,
};
