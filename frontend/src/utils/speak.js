export const speak = async (text) => {
  try {
    const response = await fetch("/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    const blob = await response.blob();

    const audioUrl = URL.createObjectURL(blob);

    const audio = new Audio(audioUrl);

    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

  } catch (error) {
    console.error("Speech Error:", error);
  }
};

// Keep this because WeatherPage.jsx uses it
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

  return String(text).replace(/[0-9]/g, (d) => map[d]);
}