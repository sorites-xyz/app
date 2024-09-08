import { useSignal } from "@preact/signals";
import { useMarkets } from "../../../blockchain/hooks/useMarkets.ts";
import { useSorites } from "../../../blockchain/hooks/useSorites.ts";
import { NewEventModalButton } from "../../components/NewEventModalButton/NewEventModalButton.tsx";
import { Pills } from "../../components/Pills/Pills.tsx";
import { MarketCard } from "./MarketCard.tsx";
import { demoGlobals } from "../../../blockchain/demoGlobals.ts";

export function Markets() {
  const currentTag = useSignal<string | null>(null);

  const sorites = useSorites();

  if (!demoGlobals.value.marketEvents) return null;

  const tags = [
    ...new Set(
      demoGlobals.value.marketEvents!.flatMap((market) => market.tags),
    ),
  ];

  const marketsToDisplay = currentTag.value
    ? demoGlobals.value.marketEvents!.filter((market) =>
      market.tags.includes(currentTag.value!)
    )
    : demoGlobals.value.marketEvents || [];

  return (
    <div class="container gap-container">
      <div class="text-button-row">
        <h1>Markets</h1>
        <NewEventModalButton sorites={sorites} />
      </div>

      {demoGlobals.value.marketEvents.length === 0 && (
        <div class="empty-box">
          There are no Market Events yet. You should create one!
        </div>
      )}

      {demoGlobals.value.marketEvents.length > 0 && (
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
