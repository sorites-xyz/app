import { useSignal, useSignalEffect } from "@preact/signals";
import { PortfolioItem } from "../../types.ts";
import { useMarkets } from "./useMarkets.ts";
import { useSorites } from "./useSorites.ts";
import { useWallet } from "./useWallet.ts";

export function usePortfolioItems() {
  const portfolioItems = useSignal<PortfolioItem[]>([]);
  const startedLoading = useSignal(false);

  const sorites = useSorites();
  const markets = useMarkets(sorites);
  const wallet = useWallet();

  async function load() {
    const tokenIdsToCheck = Array(markets.value!.length * 2).fill(0).map((
      _,
      i,
    ) => i);

    const balances = await sorites.value?.soritesContract.balanceOfBatch(
      Array(markets.value!.length * 2).fill(
        wallet.connections.value.currentAddress,
      ),
      tokenIdsToCheck,
    );

    const newPortfolioItems: PortfolioItem[] = [];

    for (let i = 0; i < balances.length; i++) {
      if (balances[i] === 0n) continue;

      const market = markets.value![Math.floor(i / 2)];

      newPortfolioItems.push({
        tokenId: String(i),
        label: market.label,
        endTime: market.endTime,
        heldTokens: Number(balances[i]),
        outcome: i % 2 === 0 ? "no" : "yes",
        status: "open",
        totalTokens: market.totalTokens,
        totalUSDC: market.totalAmount,
      });
    }

    portfolioItems.value = newPortfolioItems;
  }

  useSignalEffect(() => {
    if (startedLoading.value || markets.value === null) {
      return;
    }

    startedLoading.value = true;

    load();
  });

  return portfolioItems;
}
