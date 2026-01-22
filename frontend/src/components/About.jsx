export default function About() {
  return (
    <section id="about" className="py-20 flex justify-center">
      <div className="max-w-6xl grid grid-cols-2 gap-10">
        <div>
          <span className="bg-green-100 text-primary px-4 py-1 rounded-full text-sm">
            About the Project
          </span>

          <h2 className="mt-4 text-3xl font-serif font-bold">
            Protecting Paddy Yields Through Predictive Intelligence
          </h2>

          <p className="mt-4 text-gray-600">
            Our ML system analyzes historical and real-time agro-meteorological
            data to detect early stress conditions and forecast potential crop
            damage before it becomes visible.
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-xl">
          <ul className="space-y-4">
            <li>🌦 Weather Integration</li>
            <li>🤖 Machine Learning</li>
            <li>🛡 Proactive Protection</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
