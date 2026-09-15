import React from 'react';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  {
    id: 'mat_crt_monitor',
    title: 'CRT Monitor',
    hindi: 'टीवी / मॉनिटर',
    marathi: 'टीव्ही / मॉनिटर',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfYXZOuB0w32hdrpQ2hYu7MVLU8m3cb89Gn0E9N-0rF7mlK3I_zH4McJKioU7GV6LkYs0MgX3ZOt4xUJKQuc7mI2xypFa252gRD_ILuT1SqcSPiVtP4kexadwGvNTfifSpR0a0MPoyjX1pHC5ZZSJBZVtiVfX71rYGkLG_P11GdIEnSynAaO1-GvKUJUpH31Oy0WhFJABoLHnKp-VdscW18dhDq22-2YldYCi4I2UR4EMnHnKWS7kr',
    spoken_hi: 'सीआरटी मॉनिटर या टीवी',
    spoken_mr: 'सीआरटी मॉनिटर किंवा टीव्ही',
    spoken_en: 'CRT Monitor or Television'
  },
  {
    id: 'mat_lcd_panel',
    title: 'LCD / LED Screen',
    hindi: 'स्क्रीन / डिस्प्ले',
    marathi: 'स्क्रीन / डिस्प्ले',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtEyOx8Ugyz1nXho5fqUpiAW_WTkC35IVfkF1VUKYsAIOopYVt6L8_O6RP33VAsoFzvakBfdLpcWUGRdPSdcZNcx72doDS3frx4wRQK4gI5vzc7Z_H5q42Wbzve5gYgv-3yN9HHuIvQTjolyFR-EYm2Hw50HiSRcuxJ7tYg38ocUKhCbfSklLondnIy9vGWL0WUCY_f8MrxXuKYIO0iBuoA_c0iFbfCwuvLY_ptaYcvw1T7IcusJ1',
    spoken_hi: 'एलसीडी या एलईडी स्क्रीन',
    spoken_mr: 'एलसीडी किंवा एलईडी स्क्रीन',
    spoken_en: 'LCD or LED Display Screen'
  },
  {
    id: 'mat_cables_copper',
    title: 'Copper Cable',
    hindi: 'तांबे के तार',
    marathi: 'तांब्याची केबल',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGKj8KRJRJgco4b7M7Pgpxibea-Lq10FqtUsobeplyXqvXdougegxuKhCZbLIfPqFJvtfEoU_bV3llxV_Jzw5_e-n2phYvAKXYYzFbGCVkudTiABQa66aokYpWo4Rnvmk5WkKHAQjXPpaDTU47xwcvKSZPqs5BT2n0FnbtRJB0s-1MW4HFiooFluRkYKFY4HY0LtXIXLQhHkH3kVfgKL-3XfXleL3drRbYwpwBKEdi8qKmIibEmXh6',
    spoken_hi: 'तांबे के बिजली के तार',
    spoken_mr: 'तांब्याची वीज केबल आणि वायर',
    spoken_en: 'Insulated Copper Wire and Cables'
  },
  {
    id: 'mat_batteries_lead',
    title: 'Battery',
    hindi: 'बैटरी (लीड / लीथियम)',
    marathi: 'बॅटरी (लेड / लिथियम)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwlAe9K0CDtXrpz1da7B9u44Kn2Zw0zqIjV1zIlMd_1Lf3CzSig2iVXRxeroSAuNL3xhQ4VYmGcerwdcJznw0K-W5kMaBYwahmb3gSoEPauZYi_clPjMZaNiPh_xAA5xI5EA3St9CH4iNaOtF1hlUSR6So93DuLpLy9FhAvsVAsAsJ4T9li2nAiM2I4YVTbBKM0A0im7QWEAcVJnAo7mgzkuh2SYAHI0q75UgFEeRreTZZhjefUI2p',
    spoken_hi: 'लेड-एसिड या लिथियम बैटरी',
    spoken_mr: 'लेड-अ‍ॅसिड किंवा लिथियम बॅटरी',
    spoken_en: 'Lead Acid or Lithium Battery'
  },
  {
    id: 'mat_pcb_high',
    title: 'Circuit Board (PCB)',
    hindi: 'प्लेट / मदरबोर्ड',
    marathi: 'सर्किट बोर्ड / मदरबोर्ड',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0_YqtMM-8LZ6BsfCuCKu_Q8Lz9odO_Cv1n6Ui4H-5CYV-MQUkulZKEaKM2J-WY8bN0qRZMWYQhBD8MnFPX2TkxprUQWMAvVoWTUOgvm6x6A1-6T7pdXLr56WhOB-T2spijs9QajElCjExBnpy15voycK6noqBphs_VcM0Bflgdl426ozPfdmJaB2xxZCwcJ4eT0K3GXrLX_ZnN6i4Rr0ttbToM7uynjbQe3dAgG2ZoGrku5RXkTmn',
    spoken_hi: 'सर्किट बोर्ड या मदरबोर्ड',
    spoken_mr: 'सर्किट बोर्ड किंवा मदरबोर्ड',
    spoken_en: 'Printed Circuit Board and Motherboard'
  },
  {
    id: 'mat_motors_magnets',
    title: 'Electric Motor',
    hindi: 'मोटर / तांबा कोर',
    marathi: 'इलेक्ट्रिक मोटर / कोर',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtvdmbxQII78S5QBPq-vnuvZsisgOAHpw5ZD39_drLoPC-Kel4c17WXqBPjSqs6LlWw8aHNJTQ_oI4ky57UobXk-UhLgOix26_3jymR7S_FKjc9-uKk5em_6Sm-_HEsbhBIKMypXH9hj9tAjOxO6eFv5s-LUJFR_eNx7DsUPQ37-tbl7z9KKBe-Y63eeiMf4cmiXX3O3fHWSKYdfsiS07g6FnZQYp7jzvQljtmQSuoRGEQdqUJO1Kx',
    spoken_hi: 'इलेक्ट्रिक मोटर या चुंबक',
    spoken_mr: 'इलेक्ट्रिक मोटर किंवा तांब्याचा गाभा',
    spoken_en: 'Electric Motor or Copper Core'
  },
  {
    id: 'mat_mixed_plastics',
    title: 'Mixed Engineering Plastics',
    hindi: 'टेक्निकल प्लास्टिक (ABS/HIPS)',
    marathi: 'तांत्रिक प्लास्टिक (ABS/HIPS)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT-wPZ_m35b2v9c_4h_3',
    spoken_hi: 'मिक्स्ड इंजीनियरिंग प्लास्टिक',
    spoken_mr: 'मिश्रित अभियांत्रिकी प्लास्टिक',
    spoken_en: 'Mixed Engineering Plastics'
  }
];

const CAT_TRANSLATIONS = {
  hi: {
    materialSelection: 'सामग्री चयन',
    manualCorrection: 'मैनुअल सुधार • श्रेणी चयन',
    selectMaterialTitle: 'सामग्री श्रेणी चुनें',
    selectMaterialDesc: 'कार्ड या स्पीकर पर टैप करके जांचें',
    speakInstruction: 'सामग्री चुनें, सुनने के लिए स्पीकर दबाएं',
    navHome: 'होम',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  mr: {
    materialSelection: 'सामग्री निवड',
    manualCorrection: 'मॅन्युअल सुधारणा • श्रेणी निवड',
    selectMaterialTitle: 'सामग्री श्रेणी निवडा',
    selectMaterialDesc: 'कार्ड किंवा स्पीकरवर टॅप करून खात्री करा',
    speakInstruction: 'सामग्री निवडा, ऐकण्यासाठी स्पीकरवर टॅप करा',
    navHome: 'मुख्य',
    navMyLots: 'लॉट',
    navEarnings: 'कमाई',
    navSafety: 'सुरक्षा'
  },
  en: {
    materialSelection: 'Material Selection',
    manualCorrection: 'Manual Correction • Category Selection',
    selectMaterialTitle: 'Select Scrap Category',
    selectMaterialDesc: 'Tap card or speaker to verify category',
    speakInstruction: 'Select scrap category, tap speaker to listen',
    navHome: 'Home',
    navMyLots: 'My Lots',
    navEarnings: 'Earnings',
    navSafety: 'Safety'
  }
};

export default function Screen03CategorySelect({ onSelectCategory, onNavigate, currentLang: propLang, onLanguageChange }) {
  const { i18n } = useTranslation();
  const normalize = (lng) => {
    if (!lng) return 'hi';
    const s = String(lng).toLowerCase();
    if (s.startsWith('mr')) return 'mr';
    if (s.startsWith('en')) return 'en';
    return 'hi';
  };

  const safeLang = normalize(propLang || i18n.language || localStorage.getItem('relink_lang'));
  const t = CAT_TRANSLATIONS[safeLang] || CAT_TRANSLATIONS.hi;

  const speakText = (text, e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = safeLang === 'mr' ? 'mr-IN' : (safeLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (cat) => {
    const primaryName = safeLang === 'mr' ? cat.marathi : (safeLang === 'hi' ? cat.hindi : cat.title);
    const subName = safeLang === 'en' ? cat.title : (safeLang === 'mr' ? cat.spoken_mr : cat.spoken_hi);
    onSelectCategory({
      materialId: cat.id,
      materialTitle: primaryName,
      materialSub: subName,
      confidence: 100
    });
    onNavigate('ai_scan');
  };

  return (
    <div className="collector-shell bg-background text-on-background min-h-screen pb-[80px]">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-on-background border-b border-outline-variant dark:border-outline docked full-width top-0 sticky z-40">
        <div className="flex justify-between items-center w-full px-margin-mobile h-touch-target-min">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('ai_scan')}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md font-bold text-primary leading-tight">RE:LINK</span>
              <span className="text-[11px] text-on-surface-variant font-medium leading-none">{t.materialSelection}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLanguageChange && (
              <button
                onClick={onLanguageChange}
                className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-xs font-bold cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm text-primary">language</span>
                <span>{safeLang === 'hi' ? 'हिन्दी' : (safeLang === 'mr' ? 'मराठी' : 'EN')}</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-xs">
              👷‍♂️
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header with Audio */}
        <div className="mb-lg flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-label-md font-semibold text-xs">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              {t.manualCorrection}
            </span>
          </div>
          <div className="flex items-center justify-between gap-sm">
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold text-xl md:text-2xl">
                {t.selectMaterialTitle}
              </h1>
              <p className="text-body-md text-on-surface-variant text-sm">
                {t.selectMaterialDesc}
              </p>
            </div>
            <button
              onClick={() => speakText(t.speakInstruction)}
              className="w-touch-target-min h-touch-target-min rounded-full flex items-center justify-center text-tertiary bg-tertiary-fixed hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors shadow-sm border border-outline-variant shrink-0 cursor-pointer"
              title="Read heading aloud"
            >
              <span className="material-symbols-outlined filled">volume_up</span>
            </button>
          </div>
        </div>

        {/* Material Grid */}
        <div className="grid grid-cols-2 gap-gutter-mobile md:grid-cols-3 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className="flex flex-col bg-surface shadow-md border-2 border-outline-variant rounded-xl overflow-hidden active:bg-surface-container-low hover:border-primary transition-all text-left group cursor-pointer"
            >
              <div className="w-full aspect-square bg-surface-container-low flex items-center justify-center relative overflow-hidden">
                <img
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  src={cat.photo}
                />
                <div className="absolute top-2 right-2 z-20">
                  <span
                    onClick={(e) => speakText(safeLang === 'mr' ? cat.spoken_mr : (safeLang === 'hi' ? cat.spoken_hi : cat.spoken_en), e)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-tertiary bg-surface/95 shadow-md border border-outline-variant hover:bg-tertiary-fixed transition-colors"
                    title="Pronounce in Hindi / Marathi / English"
                  >
                    <span className="material-symbols-outlined filled text-[20px]">volume_up</span>
                  </span>
                </div>
              </div>
              <div className="p-md border-t border-outline-variant w-full bg-surface flex flex-col items-center text-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors text-base">
                  {safeLang === 'mr' ? cat.marathi : (safeLang === 'hi' ? cat.hindi : cat.title)}
                </span>
                {safeLang !== 'en' && (
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium text-xs mt-0.5">
                    {cat.title}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">{t.navHome}</span>
        </button>
        <button onClick={() => onNavigate('my_lots')} className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg p-1 cursor-pointer">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-md text-xs mt-1">{t.navMyLots}</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">{t.navEarnings}</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">{t.navSafety}</span>
        </button>
      </nav>
    </div>
  );
}
