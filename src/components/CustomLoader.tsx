export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
      {/* Center wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Glow ring */}
        <div className="absolute h-26 w-26 rounded-full bg-blue-500/20 animate-ping" />

        {/* Pulse ring */}
        <div className="absolute h-17 w-17 rounded-full bg-indigo-500/30 animate-pulse" />

        {/* Text (centered properly) */}
        <span className="relative text-sm font-medium text-gray-600">
          Loading
        </span>
      </div>
    </div>
  );
}
