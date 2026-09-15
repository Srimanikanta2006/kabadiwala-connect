/**
 * Speech Synthesis Utility for Indic Vernacular Support (Hindi, Marathi, English)
 * Ensures robust audio playback on all browsers and platforms, specifically handling
 * the common Windows/Chrome issue where 'mr-IN' (Marathi) has no installed voice
 * by gracefully falling back to Devanagari-compatible Hindi voices so Marathi text
 * is pronounced clearly and audibly instead of failing silently.
 */

let cachedVoices = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Finds the most suitable SpeechSynthesisVoice for a given language code.
 * @param {string} langCode - 'mr', 'hi', or 'en'
 * @returns {SpeechSynthesisVoice|null}
 */
export function getBestVoice(langCode = 'hi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = (cachedVoices && cachedVoices.length > 0)
    ? cachedVoices
    : window.speechSynthesis.getVoices();

  if (!voices || voices.length === 0) return null;

  const code = String(langCode).toLowerCase();

  // 1. Marathi requested
  if (code.startsWith('mr')) {
    // Check for native Marathi voice
    const mrVoice = voices.find(v => 
      (v.lang && v.lang.toLowerCase().includes('mr')) ||
      (v.name && v.name.toLowerCase().includes('marathi'))
    );
    if (mrVoice) return mrVoice;

    // Fallback: Marathi uses Devanagari script; Hindi voice reads it flawlessly!
    const hiVoice = voices.find(v => 
      (v.lang && v.lang.toLowerCase().includes('hi')) ||
      (v.name && v.name.toLowerCase().includes('hindi'))
    );
    if (hiVoice) return hiVoice;

    // Do NOT return English voice for Marathi! Return null so utterance.lang handles it
    return null;
  }

  // 2. Hindi requested
  if (code.startsWith('hi')) {
    const hiVoice = voices.find(v => 
      (v.lang && v.lang.toLowerCase().includes('hi')) ||
      (v.name && v.name.toLowerCase().includes('hindi'))
    );
    if (hiVoice) return hiVoice;

    // Do NOT return English voice for Hindi! Return null so utterance.lang handles it
    return null;
  }

  // 3. English requested
  if (code.startsWith('en')) {
    const enInVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('en-in'));
    if (enInVoice) return enInVoice;
    const enVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (enVoice) return enVoice;
    return voices[0] || null;
  }

  return null;
}

/**
 * Robust Speech Synthesis function that speaks vernacular text reliably.
 * @param {string} text - text to speak
 * @param {string} lang - 'mr', 'hi', or 'en'
 * @param {Function} [onEnd] - optional completion callback
 * @param {Function} [onError] - optional error callback
 */
export function speakVernacular(text, lang = 'hi', onEnd = null, onError = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    if (onEnd) onEnd();
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Chrome bug workaround: wait 50ms after cancel before calling speak
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getBestVoice(lang);

        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          // If no specific voice installed, set appropriate BCP 47 language tag
          utterance.lang = lang === 'mr' ? 'hi-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
        }

        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        let hasFinished = false;
        const finish = () => {
          if (!hasFinished) {
            hasFinished = true;
            if (onEnd) onEnd();
          }
        };

        utterance.onend = finish;
        utterance.onerror = (e) => {
          console.warn('Speech synthesis notice:', e);
          if (onError) onError(e);
          finish();
        };

        // Fallback timer: if onend never fires, unfreeze after estimated duration
        const durationEstimate = Math.max(2500, (text.length / 8) * 1000);
        setTimeout(finish, durationEstimate + 1500);

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('TTS speak error:', innerErr);
        if (onEnd) onEnd();
      }
    }, 50);
  } catch (err) {
    console.warn('TTS cancel/prep error:', err);
    if (onEnd) onEnd();
  }
}
