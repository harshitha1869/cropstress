export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-soft">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full"></div>
        <div>
          <h1 className="font-semibold">CropGuard</h1>
          <p className="text-xs text-gray-500">Paddy Damage Prediction</p>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-gray-600">
        <a href="#predict">Predict</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </div>
    </nav>
  );
}
