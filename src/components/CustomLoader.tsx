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

export function InlineLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full min-h-[200px]">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />

        {/* Inner pulse dot */}
        <div className="h-6 w-6 rounded-full bg-blue-500 animate-pulse" />
      </div>
      <span className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        {label}
      </span>
    </div>
  );
}
