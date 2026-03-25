export const dealerHeaders = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"] as const;

export type DealerHeader = (typeof dealerHeaders)[number];
export type StrategyCode = "H" | "S" | "D/H" | "D/S" | "P" | "P/H" | "R/H";

export type StrategyRow = {
  label: string;
  values: readonly StrategyCode[];
};

export type StrategySection = {
  key: "hard" | "soft" | "pairs";
  title: string;
  rows: readonly StrategyRow[];
};

// Assumptions:
// - Standard multi-deck blackjack
// - Dealer stands on soft 17
// - Double after split is allowed where noted with P/H
// - Late surrender is available where noted with R/H
export const basicStrategySections: readonly StrategySection[] = [
  {
    key: "hard",
    title: "Hard Totals",
    rows: [
      { label: "8", values: ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"] },
      { label: "9", values: ["H", "D/H", "D/H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "10", values: ["D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "H", "H"] },
      { label: "11", values: ["D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "H"] },
      { label: "12", values: ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"] },
      { label: "13", values: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"] },
      { label: "14", values: ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"] },
      { label: "15", values: ["S", "S", "S", "S", "S", "H", "H", "H", "R/H", "H"] },
      { label: "16", values: ["S", "S", "S", "S", "S", "H", "H", "R/H", "R/H", "R/H"] },
      { label: "17", values: ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"] },
    ],
  },
  {
    key: "soft",
    title: "Soft Totals",
    rows: [
      { label: "A,2", values: ["H", "H", "H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "A,3", values: ["H", "H", "H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "A,4", values: ["H", "H", "D/H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "A,5", values: ["H", "H", "D/H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "A,6", values: ["H", "D/H", "D/H", "D/H", "D/H", "H", "H", "H", "H", "H"] },
      { label: "A,7", values: ["S", "D/S", "D/S", "D/S", "D/S", "S", "S", "H", "H", "H"] },
      { label: "A,8", values: ["S", "S", "S", "S", "D/S", "S", "S", "S", "S", "S"] },
      { label: "A,9", values: ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"] },
    ],
  },
  {
    key: "pairs",
    title: "Pairs",
    rows: [
      { label: "2,2", values: ["P/H", "P/H", "P", "P", "P", "P/H", "H", "H", "H", "H"] },
      { label: "3,3", values: ["P/H", "P/H", "P", "P", "P", "P/H", "H", "H", "H", "H"] },
      { label: "4,4", values: ["H", "H", "H", "P/H", "P/H", "H", "H", "H", "H", "H"] },
      { label: "5,5", values: ["D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "D/H", "H", "H"] },
      { label: "6,6", values: ["P/H", "P", "P", "P", "P", "H", "H", "H", "H", "H"] },
      { label: "7,7", values: ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"] },
      { label: "8,8", values: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"] },
      { label: "9,9", values: ["P", "P", "P", "P", "P", "S", "P", "P", "S", "S"] },
      { label: "10,10", values: ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"] },
      { label: "A,A", values: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"] },
    ],
  },
] as const;

export const strategyLegend: ReadonlyArray<{ code: StrategyCode; label: string }> = [
  { code: "H", label: "Hit" },
  { code: "S", label: "Stand" },
  { code: "P", label: "Split" },
  { code: "D/H", label: "Double if possible, otherwise Hit" },
  { code: "D/S", label: "Double if possible, otherwise Stand" },
  { code: "P/H", label: "Split if double after split is allowed, otherwise Hit" },
  { code: "R/H", label: "Surrender if possible, otherwise Hit" },
];

