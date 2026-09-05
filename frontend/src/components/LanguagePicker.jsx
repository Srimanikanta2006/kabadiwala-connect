import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguagePicker.css';

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳', script: 'देवनागरी' },
  { code: 'mr', label: 'मराठी', flag: '🚩', script: 'मराठी' },
  { code: 'en', label: 'English', flag: '🌐', script: 'Latin' }
];

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'hi';

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('relink_lang', code);
  };

  return (
    <div className="lang-picker-container" aria-label="Language selection">
      <div className="lang-picker-buttons">
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              className={`lang-option-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-pressed={isActive}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-native-name">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
