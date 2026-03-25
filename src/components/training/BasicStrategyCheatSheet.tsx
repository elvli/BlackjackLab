"use client";

import { useState } from "react";

import {
  basicStrategySections,
  dealerHeaders,
  strategyLegend,
  type StrategyCode,
} from "@/lib/basicStrategy";

function getCellClasses(code: StrategyCode) {
  if (code.startsWith("P")) {
    return "bg-amber-300/90 text-amber-950";
  }

  if (code.startsWith("D")) {
    return "bg-emerald-300/90 text-emerald-950";
  }

  if (code.startsWith("R")) {
    return "bg-violet-300/90 text-violet-950";
  }

  if (code === "H") {
    return "bg-sky-300/90 text-sky-950";
  }

  return "bg-rose-300/90 text-rose-950";
}

export default function BasicStrategyCheatSheet() {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="rounded-full border border-white/15 bg-black/65 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75"
        >
          Strategy
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-10 w-[min(30rem,calc(100%-2rem))] rounded-xl border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <div>
          <p className="text-sm font-semibold">Basic Strategy</p>
          <p className="text-[11px] text-white/70">
            Multi-deck chart with compact action codes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="rounded-md border border-white/15 px-2 py-1 text-xs font-medium text-white/90 transition hover:bg-white/10"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="max-h-[26rem] overflow-auto px-3 py-3">
        <table className="w-full border-collapse text-[10px] leading-tight">
          <thead className="sticky top-0 z-10 bg-slate-900/95">
            <tr>
              <th className="border border-white/10 bg-slate-800/95 px-2 py-1 text-left font-semibold">
                Player
              </th>
              {dealerHeaders.map((header) => (
                <th
                  key={header}
                  className="border border-white/10 bg-slate-800/95 px-2 py-1 text-center font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {basicStrategySections.map((section) => (
              <FragmentRows key={section.key}>
                <tr>
                  <th
                    colSpan={dealerHeaders.length + 1}
                    className="border border-white/10 bg-white/10 px-2 py-1 text-left text-[11px] font-semibold tracking-wide text-white/90"
                  >
                    {section.title}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={`${section.key}-${row.label}`}>
                    <th className="border border-white/10 bg-slate-900/80 px-2 py-1 text-left font-medium whitespace-nowrap">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${dealerHeaders[index]}`}
                        className={`border border-white/10 px-2 py-1 text-center font-semibold ${getCellClasses(value)}`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </FragmentRows>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 px-3 py-2">
        <div className="grid gap-1 text-[10px] text-white/80 sm:grid-cols-2">
          {strategyLegend.map((item) => (
            <div key={item.code} className="flex items-start gap-2">
              <span
                className={`inline-flex min-w-10 items-center justify-center rounded px-1.5 py-0.5 font-semibold ${getCellClasses(item.code)}`}
              >
                {item.code}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentRows({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
