export default function Features() {
  const items = [
    ["Temperature Analysis", "Monitor thermal stress conditions"],
    ["Moisture Tracking", "Track soil moisture & rainfall"],
    ["Solar & Heat Stress", "Analyze radiation impact"],
    ["ML-Powered Predictions", "Logistic Regression model"],
    ["Early Detection", "Detect stress early"],
    ["Actionable Insights", "Prevent yield loss"],
  ];

  return (
    <section id="features" className="py-20 text-center">
      <h2 className="text-3xl font-serif font-semibold">
        Comprehensive Analysis
      </h2>
      <p className="text-gray-500 mt-2">
        Our system analyzes multiple environmental factors
      </p>

      <div className="grid grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        {items.map(([title, desc]) => (
          <div key={title} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
