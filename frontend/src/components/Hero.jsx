export default function Hero() {
  const scrollToPredict = () => {
    document.getElementById("predict")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="text-center py-20">
      <span className="inline-flex items-center gap-2 bg-green-100 text-primary px-4 py-1 rounded-full text-sm">
        ⚡ Machine Learning Powered
      </span>

      <h1 className="mt-6 text-5xl font-serif font-bold">
        Early Prediction of <span className="text-primary">Crop Damage</span>
        <br /> for Paddy Fields
      </h1>

      <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
        Analyze weather and soil micro-indicators to detect stress patterns and
        forecast potential damage before it becomes visible.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={scrollToPredict}
          className="bg-primary text-white px-6 py-3 rounded-lg"
        >
          Start Prediction ↓
        </button>

        <button
          onClick={scrollToAbout}
          className="border border-primary px-6 py-3 rounded-lg text-primary"
        >
          Learn More
        </button>
      </div>

      <div className="mt-10 flex justify-center gap-12 text-sm">
        <div>
          <p className="text-xl font-semibold">11</p>
          <p className="text-gray-500">Input Parameters</p>
        </div>
        <div>
          <p className="text-xl font-semibold">85%</p>
          <p className="text-gray-500">Accuracy Rate</p>
        </div>
        <div>
          <p className="text-xl font-semibold">&lt;1s</p>
          <p className="text-gray-500">Prediction Time</p>
        </div>
      </div>
    </section>
  );
}
