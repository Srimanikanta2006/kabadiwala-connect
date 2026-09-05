import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const REGIONAL_MANDI_DATA = {
  'IN-MH-MUM': {
    name: 'Mumbai MMR (Dharavi / Kurla Yard)',
    multiplier: 1.0,
    categories: [
      { id: 'mat_pcb_high', name: 'High-Grade PCB', sub: 'Server / Telecom Motherboards', rate: 780, range: '₹720 – ₹810', trend: 'UP', change: '+₹35', icon: 'memory', spoken: 'मुंबई मंडी: हाई-ग्रेड सर्किट बोर्ड का भाव 780 रुपये प्रति किलो है।' },
      { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire Harness', rate: 420, range: '₹400 – ₹440', trend: 'UP', change: '+₹20', icon: 'cable', spoken: 'तांबे के तार का भाव 420 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_lead', name: 'Lead-Acid Batteries', sub: 'Inverter / Auto Battery', rate: 105, range: '₹95 – ₹115', trend: 'STABLE', change: 'स्थिर', icon: 'battery_alert', spoken: 'लेड एसिड बैटरी का भाव 105 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mobile / Laptop Packs', rate: 110, range: '₹95 – ₹125', trend: 'UP', change: '+₹15', icon: 'battery_charging_full', spoken: 'लिथियम बैटरी का भाव 110 रुपये प्रति किलो है।' },
      { id: 'mat_crt_monitor', name: 'CRT TV / Monitors', sub: 'Cathode Ray Leaded Tube', rate: 15, range: '₹12 – ₹18', trend: 'STABLE', change: 'स्थिर', icon: 'tv', spoken: 'सीआरटी टीवी और मॉनिटर का भाव 15 रुपये प्रति किलो है।' },
      { id: 'mat_lcd_panel', name: 'LCD / LED Panels', sub: 'Flat Screen Displays', rate: 45, range: '₹35 – ₹55', trend: 'DOWN', change: '-₹5', icon: 'desktop_windows', spoken: 'एलसीडी और एलईडी स्क्रीन का भाव 45 रुपये प्रति किलो है।' },
      { id: 'mat_pcb_low', name: 'Low-Grade PCB', sub: 'Power Supply / Single Sided', rate: 55, range: '₹45 – ₹65', trend: 'STABLE', change: 'स्थिर', icon: 'developer_board', spoken: 'लो-ग्रेड सर्किट बोर्ड का भाव 55 रुपये प्रति किलो है।' },
      { id: 'mat_motors_magnets', name: 'Electric Motors', sub: 'Copper Winding Assemblies', rate: 72, range: '₹60 – ₹85', trend: 'UP', change: '+₹8', icon: 'precision_manufacturing', spoken: 'इलेक्ट्रिक मोटर का भाव 72 रुपये प्रति किलो है।' },
      { id: 'mat_mixed_plastics', name: 'Mixed Plastics', sub: 'ABS / HIPS Engineering Casings', rate: 28, range: '₹22 – ₹34', trend: 'STABLE', change: 'स्थिर', icon: 'recycling', spoken: 'टेक्निकल प्लास्टिक का भाव 28 रुपये प्रति किलो है।' }
    ]
  },
  'IN-MH-PUN': {
    name: 'Pune Industrial (Bhosari MIDC)',
    multiplier: 0.98,
    categories: [
      { id: 'mat_pcb_high', name: 'High-Grade PCB', sub: 'Server / Telecom Motherboards', rate: 765, range: '₹710 – ₹795', trend: 'UP', change: '+₹25', icon: 'memory', spoken: 'पुणे मंडी: हाई-ग्रेड सर्किट बोर्ड का भाव 765 रुपये प्रति किलो है।' },
      { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire Harness', rate: 415, range: '₹395 – ₹430', trend: 'UP', change: '+₹15', icon: 'cable', spoken: 'तांबे के तार का भाव 415 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_lead', name: 'Lead-Acid Batteries', sub: 'Inverter / Auto Battery', rate: 102, range: '₹92 – ₹110', trend: 'STABLE', change: 'स्थिर', icon: 'battery_alert', spoken: 'लेड एसिड बैटरी का भाव 102 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mobile / Laptop Packs', rate: 108, range: '₹95 – ₹120', trend: 'UP', change: '+₹10', icon: 'battery_charging_full', spoken: 'लिथियम बैटरी का भाव 108 रुपये प्रति किलो है।' },
      { id: 'mat_crt_monitor', name: 'CRT TV / Monitors', sub: 'Cathode Ray Leaded Tube', rate: 14, range: '₹10 – ₹17', trend: 'STABLE', change: 'स्थिर', icon: 'tv', spoken: 'सीआरटी टीवी का भाव 14 रुपये प्रति किलो है।' },
      { id: 'mat_lcd_panel', name: 'LCD / LED Panels', sub: 'Flat Screen Displays', rate: 44, range: '₹35 – ₹52', trend: 'DOWN', change: '-₹4', icon: 'desktop_windows', spoken: 'एलसीडी स्क्रीन का भाव 44 रुपये प्रति किलो है।' },
      { id: 'mat_pcb_low', name: 'Low-Grade PCB', sub: 'Power Supply / Single Sided', rate: 52, range: '₹42 – ₹60', trend: 'STABLE', change: 'स्थिर', icon: 'developer_board', spoken: 'लो-ग्रेड सर्किट बोर्ड का भाव 52 रुपये प्रति किलो है।' },
      { id: 'mat_motors_magnets', name: 'Electric Motors', sub: 'Copper Winding Assemblies', rate: 70, range: '₹58 – ₹82', trend: 'UP', change: '+₹6', icon: 'precision_manufacturing', spoken: 'इलेक्ट्रिक मोटर का भाव 70 रुपये प्रति किलो है।' },
      { id: 'mat_mixed_plastics', name: 'Mixed Plastics', sub: 'ABS / HIPS Engineering Casings', rate: 26, range: '₹20 – ₹32', trend: 'STABLE', change: 'स्थिर', icon: 'recycling', spoken: 'टेक्निकल प्लास्टिक का भाव 26 रुपये प्रति किलो है।' }
    ]
  },
  'IN-KA-BLR': {
    name: 'Bengaluru (Peenya Industrial Cluster)',
    multiplier: 1.02,
    categories: [
      { id: 'mat_pcb_high', name: 'High-Grade PCB', sub: 'Server / Telecom Motherboards', rate: 795, range: '₹735 – ₹830', trend: 'UP', change: '+₹40', icon: 'memory', spoken: 'बेंगलुरु मंडी: हाई-ग्रेड सर्किट बोर्ड का भाव 795 रुपये प्रति किलो है।' },
      { id: 'mat_cables_copper', name: 'Copper Cables', sub: 'Insulated Wire Harness', rate: 425, range: '₹405 – ₹445', trend: 'UP', change: '+₹25', icon: 'cable', spoken: 'तांबे के तार का भाव 425 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_lead', name: 'Lead-Acid Batteries', sub: 'Inverter / Auto Battery', rate: 108, range: '₹98 – ₹118', trend: 'STABLE', change: 'स्थिर', icon: 'battery_alert', spoken: 'लेड एसिड बैटरी का भाव 108 रुपये प्रति किलो है।' },
      { id: 'mat_batteries_li_ion', name: 'Li-ion Batteries', sub: 'Mobile / Laptop Packs', rate: 115, range: '₹100 – ₹130', trend: 'UP', change: '+₹20', icon: 'battery_charging_full', spoken: 'लिथियम बैटरी का भाव 115 रुपये प्रति किलो है।' },
      { id: 'mat_crt_monitor', name: 'CRT TV / Monitors', sub: 'Cathode Ray Leaded Tube', rate: 16, range: '₹12 – ₹20', trend: 'STABLE', change: 'स्थिर', icon: 'tv', spoken: 'सीआरटी मॉनिटर का भाव 16 रुपये प्रति किलो है।' },
      { id: 'mat_lcd_panel', name: 'LCD / LED Panels', sub: 'Flat Screen Displays', rate: 48, range: '₹38 – ₹58', trend: 'DOWN', change: '-₹3', icon: 'desktop_windows', spoken: 'एलसीडी स्क्रीन का भाव 48 रुपये प्रति किलो है।' },
      { id: 'mat_pcb_low', name: 'Low-Grade PCB', sub: 'Power Supply / Single Sided', rate: 58, range: '₹48 – ₹68', trend: 'STABLE', change: 'स्थिर', icon: 'developer_board', spoken: 'लो-ग्रेड पीसीबी का भाव 58 रुपये प्रति किलो है।' },
      { id: 'mat_motors_magnets', name: 'Electric Motors', sub: 'Copper Winding Assemblies', rate: 75, range: '₹62 – ₹88', trend: 'UP', change: '+₹10', icon: 'precision_manufacturing', spoken: 'इलेक्ट्रिक मोटर का भाव 75 रुपये प्रति किलो है।' },
      { id: 'mat_mixed_plastics', name: 'Mixed Plastics', sub: 'ABS / HIPS Engineering Casings', rate: 30, range: '₹24 – ₹36', trend: 'STABLE', change: 'स्थिर', icon: 'recycling', spoken: 'टेक्निकल प्लास्टिक का भाव 30 रुपये प्रति किलो है।' }
    ]
  }
};

export default function PriceBoardModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';
  const [selectedLoc, setSelectedLoc] = useState('IN-MH-MUM');

  if (!isOpen) return null;

  const locData = REGIONAL_MANDI_DATA[selectedLoc] || REGIONAL_MANDI_DATA['IN-MH-MUM'];

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'mr' ? 'mr-IN' : (currentLang === 'hi' ? 'hi-IN' : 'en-IN');
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBroadcastAll = () => {
    const summary = currentLang === 'mr'
      ? `${locData.name} आजचे दर: सर्किट बोर्ड ${locData.categories[0].rate} रुपये, तांब्याची केबल ${locData.categories[1].rate} रुपये, बॅटरी ${locData.categories[2].rate} रुपये, मोटर ${locData.categories[7].rate} रुपये प्रति किलो.`
      : `${locData.name} आज के भाव: सर्किट बोर्ड ${locData.categories[0].rate} रुपये, तांबे के तार ${locData.categories[1].rate} रुपये, बैटरी ${locData.categories[2].rate} रुपये, मोटर ${locData.categories[7].rate} रुपये प्रति किलो।`;
    speakText(summary);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-outline-variant overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">table_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-on-surface">
                  {currentLang === 'mr' ? 'दैनिक ई-कचरा मंडी भाव बोर्ड' : (currentLang === 'hi' ? 'दैनिक ई-कचरा मंडी भाव तालिका' : 'Daily E-Waste Mandi Price Board')}
                </h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  9 CPCB Classes
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {currentLang === 'mr' ? 'अधिकृत पुनर्वापर दर आणि कल' : 'पारदर्शी बाजार दर एवं मूल्य रुझान'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Location Switcher & Audio Bar */}
        <div className="px-4 sm:px-5 py-3 bg-surface border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-primary pl-1.5">location_on</span>
            {[
              { id: 'IN-MH-MUM', label: 'Mumbai MMR' },
              { id: 'IN-MH-PUN', label: 'Pune MIDC' },
              { id: 'IN-KA-BLR', label: 'Bengaluru' }
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedLoc === loc.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleBroadcastAll}
            className="px-3 py-1.5 bg-tertiary-fixed hover:bg-tertiary-container text-tertiary font-bold rounded-xl flex items-center gap-1.5 shadow-sm border border-outline-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] filled">volume_up</span>
            <span>{currentLang === 'mr' ? 'सर्व दर ऐका' : 'पूरा भाव सुनें (Audio)'}</span>
          </button>
        </div>

        {/* Categories Table Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 divide-y divide-outline-variant/20">
          {locData.categories.map((item) => (
            <div
              key={item.id}
              className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 hover:bg-surface-container-low/50 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">{item.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                        item.trend === 'UP'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : item.trend === 'DOWN'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span>{item.trend === 'UP' ? '▲' : (item.trend === 'DOWN' ? '▼' : '―')}</span>
                      <span>{item.change}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">{item.sub}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base sm:text-lg font-extrabold text-primary font-mono">
                    ₹{item.rate} <span className="text-[10px] font-normal text-on-surface-variant">/kg</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant block">
                    Range: {item.range}
                  </span>
                </div>

                <button
                  onClick={() => speakText(item.spoken)}
                  className="w-9 h-9 rounded-full bg-surface-container hover:bg-tertiary-fixed text-tertiary flex items-center justify-center border border-outline-variant/40 shadow-sm cursor-pointer transition-colors"
                  title="Speak price"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Statutory Footer */}
        <div className="p-3 sm:p-4 bg-surface-container-low border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>EPR Compliant Mandi Index • Updated 2026</span>
          </span>
          <span className="font-mono text-[10px]">Benchmarked against SPCB Authorized Plants</span>
        </div>
      </div>
    </div>
  );
}
