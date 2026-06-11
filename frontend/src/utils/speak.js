let currentAudio = null;

export const speak = async (text) => {
  try {
    console.log("🔊 gTTS SPEAK CALLED");
    console.log("Text:", text);

    // Stop previous audio if already playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const response = await fetch("/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Failed to generate speech");
    }

    const blob = await response.blob();

    console.log("Audio Blob:", blob);

    const audioUrl = URL.createObjectURL(blob);

    currentAudio = new Audio(audioUrl);

    currentAudio.onloadeddata = () => {
      console.log("✅ Audio loaded");
    };

    currentAudio.onplay = () => {
      console.log("▶️ Audio playing");
    };

    currentAudio.onerror = (e) => {
      console.error("❌ Audio Error:", e);
    };

    currentAudio.onended = () => {
      console.log("✅ Audio finished");
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };

    await currentAudio.play();

  } catch (error) {
    console.error("❌ Speech Error:", error);
  }
};

export function stopSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function toTeluguDigits(text) {
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
    "9": "౯",
  };

  return String(text).replace(/[0-9]/g, (digit) => map[digit]);
}