import { effect, signal } from "@preact/signals";
import { Market, PortfolioItem } from "../types.ts";

export const demoGlobals = signal<{
  marketEvents: Market[];
  portfolioItems: PortfolioItem[];
  usdcBalance: number;
}>({
  marketEvents: [],
  portfolioItems: [],
  usdcBalance: 875.25,
});

effect(() => {
  // Local storage
  const localData = localStorage.getItem("demoGlobals2");
  if (localData) {
    demoGlobals.value = JSON.parse(localData);
  }
  demoGlobals.subscribe((value) => {
    localStorage.setItem("demoGlobals2", JSON.stringify(value));
  });
});
