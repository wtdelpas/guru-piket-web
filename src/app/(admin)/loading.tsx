import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center text-indigo-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat data...</p>
      </div>
    </div>
  );
}
