let teluguVoice = null;
let voicesReady = false;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;

  teluguVoice =
    voices.find(v => v.lang === "te-IN") ||
    voices.find(v => v.lang.includes("te")) ||
    voices.find(v => v.lang.includes("hi")) ||
    voices[0];

  voicesReady = true;
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

export const speak = (text, onStart, onEnd) => {

  if (!voicesReady) {
    setTimeout(() => speak(text, onStart, onEnd), 300);
    return;
  }
  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);

  msg.voice = teluguVoice;
  msg.lang = "te-IN";
  msg.rate = 0.9;
  msg.pitch = 1;

  if (onStart) msg.onstart = onStart;
  if (onEnd) msg.onend = onEnd;

  window.speechSynthesis.speak(msg);
};