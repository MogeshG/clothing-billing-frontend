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

export function SectionLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8 w-full">
      <div className="relative flex items-center justify-center">
        {/* Glow ring */}
        <div className="absolute h-20 w-20 rounded-full bg-blue-500/20 animate-ping" />

        {/* Pulse ring */}
        <div className="absolute h-12 w-12 rounded-full bg-indigo-500/30 animate-pulse" />

        {/* Text (centered properly) */}
        <span className="relative text-sm font-medium text-gray-600">
          {label}
        </span>
      </div>
    </div>
  );
}
