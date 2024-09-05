import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { Market } from "../../types.ts";
import { Sorites } from "./useSorites.ts";

export function useMarkets(sorites: Signal<Sorites | null>) {
  const markets = useSignal<Market[] | null>(null);

  async function loadMarkets() {
    // const marketEventCount = await sorites.soritesContract.nextMarketEventId();
    const marketEvents: Market[] = [];

    // TODO: load

    markets.value = marketEvents;
  }

  useSignalEffect(() => {
    if (sorites.value) {
      loadMarkets();
    }
  });

  return markets;
}
