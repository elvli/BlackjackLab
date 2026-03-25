"use client";

type CardCountDisplayProps = {
  count: number;
};

function getCountTone(count: number) {
  if (count > 0) {
    return "text-emerald-300";
  }

  if (count < 0) {
    return "text-rose-300";
  }

  return "text-slate-100";
}

export default function CardCountDisplay({
  count,
}: CardCountDisplayProps) {
  const formattedCount = count > 0 ? `+${count}` : `${count}`;

  return (
    <div className="absolute top-4 right-4 z-10 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-sm font-semibold shadow-lg backdrop-blur-sm">
      <span className="text-slate-200">Count: </span>
      <span className={getCountTone(count)}>{formattedCount}</span>
    </div>
  );
}
