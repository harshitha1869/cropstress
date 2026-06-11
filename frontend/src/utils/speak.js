export const speak = async (text) => {
  console.log("🔊 gTTS SPEAK CALLED");
  console.log("Text:", text);

  try {
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

    const audio = new Audio(audioUrl);

    audio.onloadeddata = () => {
      console.log("✅ Audio loaded");
    };

    audio.onplay = () => {
      console.log("▶️ Audio playing");
    };

    audio.onerror = (e) => {
      console.error("❌ Audio Error:", e);
    };

    audio.onended = () => {
      console.log("✅ Audio finished");
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();

  } catch (error) {
    console.error("❌ Speech Error:", error);
  }
};

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