let selectedVoice = null;
let voicesLoaded = false;

// Load voices
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();

  if (!voices.length) return;

  console.log("Available Voices:");
  voices.forEach(v => {
    console.log(`${v.name} - ${v.lang}`);
  });

  // Prefer Telugu
  selectedVoice =
    voices.find(v => v.lang === "te-IN") ||
    voices.find(v => v.lang.startsWith("te")) ||

    // Fallback to English India
    voices.find(v => v.lang === "en-IN") ||

    // Last fallback
    voices[0];

  console.log("Selected Voice:", selectedVoice);

  voicesLoaded = true;
}

// Some browsers load voices asynchronously
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Convert English digits to Telugu digits
function toTeluguDigits(text) {
  const map = {
    "0": "౦",
    "1": "౧",
    "2": "౨",
    "3": "౩",
    "4": "౪",
    "5": "౫",
    "6": "౬",
    "7": "౭",
    "8": "౮",
    "9": "౯"
  };

  return String(text).replace(/[0-9]/g, digit => map[digit]);
}

// Speak function
export const speak = (text, onStart, onEnd) => {

  if (!voicesLoaded) {
    setTimeout(() => speak(text, onStart, onEnd), 300);
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = selectedVoice;
  utterance.lang = "te-IN";
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
};

export { toTeluguDigits };