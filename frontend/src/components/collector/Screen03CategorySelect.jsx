import React from 'react';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  {
    id: 'mat_crt_monitor',
    title: 'CRT Monitor',
    hindi: 'टीवी / मॉनिटर',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfYXZOuB0w32hdrpQ2hYu7MVLU8m3cb89Gn0E9N-0rF7mlK3I_zH4McJKioU7GV6LkYs0MgX3ZOt4xUJKQuc7mI2xypFa252gRD_ILuT1SqcSPiVtP4kexadwGvNTfifSpR0a0MPoyjX1pHC5ZZSJBZVtiVfX71rYGkLG_P11GdIEnSynAaO1-GvKUJUpH31Oy0WhFJABoLHnKp-VdscW18dhDq22-2YldYCi4I2UR4EMnHnKWS7kr',
    spoken: 'सीआरटी मॉनिटर या टीवी'
  },
  {
    id: 'mat_lcd_panel',
    title: 'LCD / LED Screen',
    hindi: 'स्क्रीन / डिस्प्ले',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtEyOx8Ugyz1nXho5fqUpiAW_WTkC35IVfkF1VUKYsAIOopYVt6L8_O6RP33VAsoFzvakBfdLpcWUGRdPSdcZNcx72doDS3frx4wRQK4gI5vzc7Z_H5q42Wbzve5gYgv-3yN9HHuIvQTjolyFR-EYm2Hw50HiSRcuxJ7tYg38ocUKhCbfSklpLondnIy9vGWL0WUCY_f8MrxXuKYIO0iBuoA_c0iFbfCwuvLY_ptaYcvw1T7IcusJ1',
    spoken: 'एलसीडी या एलईडी स्क्रीन'
  },
  {
    id: 'mat_cables_copper',
    title: 'Copper Cable',
    hindi: 'तांबे के तार',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGKj8KRJRJgco4b7M7Pgpxibea-Lq10FqtUsobeplyXqvXdougegxuKhCZbLIfPqFJvtfEoU_bV3llxV_Jzw5_e-n2phYvAKXYYzFbGCVkudTiABQa66aokYpWo4Rnvmk5WkKHAQjXPpaDTU47xwcvKSZPqs5BT2n0FnbtRJB0s-1MW4HFiooFluRkYKFY4HY0LtXIXLQhHkH3kVfgKL-3XfXleL3drRbYwpwBKEdi8qKmIibEmXh6',
    spoken: 'तांबे के बिजली के तार'
  },
  {
    id: 'mat_batteries_lead',
    title: 'Battery',
    hindi: 'बैटरी (लीड / लीथियम)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwlAe9K0CDtXrpz1da7B9u44Kn2Zw0zqIjV1zIlMd_1Lf3CzSig2iVXRxeroSAuNL3xhQ4VYmGcerwdcJznw0K-W5kMaBYwahmb3gSoEPauZYi_clPjMZaNiPh_xAA5xI5EA3St9CH4iNaOtF1hlUSR6So93DuLpLy9FhAvsVAsAsJ4T9li2nAiM2I4YVTbBKM0A0im7QWEAcVJnAo7mgzkuh2SYAHI0q75UgFEeRreTZZhjefUI2p',
    spoken: 'लेड-एसिड या लिथियम बैटरी'
  },
  {
    id: 'mat_pcb_high',
    title: 'Circuit Board (PCB)',
    hindi: 'प्लेट / मदरबोर्ड',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0_YqtMM-8LZ6BsfCuCKu_Q8Lz9odO_Cv1n6Ui4H-5CYV-MQUkulZKEaKM2J-WY8bN0qRZMWYQhBD8MnFPX2TkxprUQWMAvVoWTUOgvm6x6A1-6T7pdXLr56WhOB-T2spijs9QajElCjExBnpy15voycK6noqBphs_VcM0Bflgdl426ozPfdmJaB2xxZCwcJ4eT0K3GXrLX_ZnN6i4Rr0ttbToM7uynjbQe3dAgG2ZoGrku5RXkTmn',
    spoken: 'सर्किट बोर्ड या मदरबोर्ड'
  },
  {
    id: 'mat_motors_magnets',
    title: 'Electric Motor',
    hindi: 'मोटर / तांबा कोर',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtvdmbxQII78S5QBPq-vnuvZsisgOAHpw5ZD39_drLoPC-Kel4c17WXqBPjSqs6LlWw8aHNJTQ_oI4ky57UobXk-UhLgOix26_3jymR7S_FKjc9-uKk5em_6Sm-_HEsbhBIKMypXH9hj9tAjOxO6eFv5s-LUJFR_eNx7DsUPQ37-tbl7z9KKBe-Y63eeiMf4cmiXX3O3fHWSKYdfsiS07g6FnZQYp7jzvQljtmQSuoRGEQdqUJO1Kx',
    spoken: 'इलेक्ट्रिक मोटर या चुंबक'
  }
];

export default function Screen03CategorySelect({ onSelectCategory, onNavigate }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const speakText = (text, e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (cat) => {
    onSelectCategory({
      materialId: cat.id,
      materialTitle: cat.title,
      materialSub: cat.hindi,
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
              <span className="text-[11px] text-on-surface-variant font-medium leading-none">Material Selection</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-outline-variant text-primary font-bold text-xs">
              👷‍♂️
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-margin-mobile py-lg max-w-4xl mx-auto">
        {/* Header with Audio */}
        <div className="mb-lg flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-label-md font-semibold text-xs">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Manual Correction / श्रेणी सुधार
            </span>
          </div>
          <div className="flex items-center justify-between gap-sm">
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold text-xl md:text-2xl">
                Select Material / सामग्री चुनें
              </h1>
              <p className="text-body-md text-on-surface-variant text-sm">
                Tap card or speaker to verify / सुनने के लिए स्पीकर दबाएं
              </p>
            </div>
            <button
              onClick={() => speakText('सामग्री चुनें, सुनने के लिए स्पीकर दबाएं')}
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
                    onClick={(e) => speakText(cat.spoken, e)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-tertiary bg-surface/95 shadow-md border border-outline-variant hover:bg-tertiary-fixed transition-colors"
                    title="Pronounce in Hindi / Marathi"
                  >
                    <span className="material-symbols-outlined filled text-[20px]">volume_up</span>
                  </span>
                </div>
              </div>
              <div className="p-md border-t border-outline-variant w-full bg-surface flex flex-col items-center text-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors text-base">
                  {cat.title}
                </span>
                <span className="font-label-md text-label-md text-primary font-bold text-sm mt-0.5">
                  {cat.hindi}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant shadow-md rounded-t-xl">
        <button onClick={() => onNavigate('home')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-xs mt-1">Home</span>
        </button>
        <button onClick={() => onNavigate('ai_scan')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-90 cursor-pointer">
          <span className="material-symbols-outlined filled">inventory_2</span>
          <span className="font-label-md text-xs font-bold mt-1">Sell / Lots</span>
        </button>
        <button onClick={() => onNavigate('earnings')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-xs mt-1">Earnings</span>
        </button>
        <button onClick={() => onNavigate('safety')} className="flex flex-col items-center justify-center p-2 text-on-surface-variant cursor-pointer">
          <span className="material-symbols-outlined">info</span>
          <span className="font-label-md text-xs mt-1">Safety</span>
        </button>
      </nav>
    </div>
  );
}
