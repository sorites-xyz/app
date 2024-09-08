import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { Market } from "../../types.ts";
import { Sorites } from "./useSorites.ts";

export function useMarkets(sorites: Signal<Sorites | null>) {
  const markets = useSignal<Market[] | null>(null);

  async function loadMarkets() {
    const marketEventCount = await sorites.value!.soritesContract
      .nextMarketEventId();
    const marketEvents: Market[] = [];

    for (let i = 0; i < marketEventCount; i++) {
      const [
        _startTime,
        endTime,
        totalUSDC,
        totalYesTokens,
        totalNoTokens,
        _status,
        _usdcWonPerWinningToken,
        futuresContractAddress,
      ] = await sorites.value!.soritesContract.marketEvents(i);

      const futuresProvider = await sorites.value!.futureProviders.find((x) =>
        x.contractAddress === futuresContractAddress
      )!;

      let marketEventName = await futuresProvider.contract.getMarketEventName(
        i,
      );

      const prettyEndDate = new Date(Number(endTime)).toString().split(" ")
        .slice(1, 4)
        .join(" ");

      marketEventName = marketEventName.replaceAll("END_DATE", prettyEndDate);

      const substitutions = await futuresProvider.contract
        .getMarketEventNameVariables(i);

      const supportedAssets = await futuresProvider.contract
        .getSupportedAssets();
      let asset: string = "";

      substitutions.forEach(([type, find, replace]: [string, string, any]) => {
        if (type === "string") {
          if (find === "ASSET") {
            asset = supportedAssets[Number(replace)];
            marketEventName = marketEventName.replaceAll(find, asset);
          } else {
            marketEventName = marketEventName.replaceAll(find, String(replace));
          }
        }

        if (type === "usdc") {
          marketEventName = marketEventName.replaceAll(
            find,
            "$" + (Number(replace)).toFixed(2),
          );
        }

        console.log("Unknown substitution type:", { type, find, replace });
      });

      marketEvents.push({
        id: String(i),
        endTime: Number(endTime),
        label: marketEventName,
        tags: [asset],
        totalAmount: Number(totalUSDC),
        betYesPercent: (Number(totalYesTokens) - 1) /
          (Number(totalYesTokens) + Number(totalNoTokens) - 2),
      });
    }

    markets.value = marketEvents;
  }

  useSignalEffect(() => {
    if (sorites.value) {
      loadMarkets();
    }
  });

  return markets;
}
