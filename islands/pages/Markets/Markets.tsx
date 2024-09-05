import { useSignal } from "@preact/signals";
import { useMarkets } from "../../../blockchain/hooks/useMarkets.ts";
import { useSorites } from "../../../blockchain/hooks/useSorites.ts";
import { NewEventModalButton } from "../../components/NewEventModalButton/NewEventModalButton.tsx";
import { Pills } from "../../components/Pills/Pills.tsx";
import { MarketCard } from "./MarketCard.tsx";

export function Markets() {
  const currentTag = useSignal<string | null>(null);

  const sorites = useSorites();
  const markets = useMarkets(sorites);

  if (!markets.value) return null;

  const tags = [...new Set(markets.value!.flatMap((market) => market.tags))];

  const marketsToDisplay = currentTag.value
    ? markets.value!.filter((market) => market.tags.includes(currentTag.value!))
    : markets.value || [];

  return (
    <div class="container gap-container">
      <div class="text-button-row">
        <h1>Markets</h1>
        <NewEventModalButton sorites={sorites} />
      </div>

      {markets.value.length > 0 && (
        <>
          <Pills
            selected={currentTag}
            options={tags.map((tag) => ({ label: tag, value: tag }))}
          />

          <div class="markets-grid">
            {marketsToDisplay.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
