import { signal } from "@preact/signals";
import { formatCurrencyShort } from "./formatCurrencyShort.ts";
import { Market } from "../../../types.ts";
import { useId } from "preact/hooks";
import { TextInput } from "../../components/TextInput/TextInput.tsx";

type MarketCardProps = {
  market: Market;
};

const openId = signal<string | null>(null);
const open = signal<"yes" | "no">("no");

export function MarketCard({ market }: MarketCardProps) {
  const id = useId();

  return (
    <div class={openId.value === id ? "market market-open" : "market"}>
      {openId.value === id && (
        <>
          <div class="market-label-wrapper">
            <div class="market-label">
              {market.label}
            </div>
            <div
              class="close"
              onClick={() => openId.value = null}
            >
              ✕
            </div>
          </div>

          <TextInput
            value="123"
            onChange={() => {}}
            placeholder="1000"
            before={<span>$</span>}
          />

          {open.value === "yes"
            ? (
              <div
                class="speculate-button speculate-button-active speculate-button-yes"
                onClick={() => open.value = "yes"}
              >
                Speculate Yes
                <small>To win $100.12</small>
              </div>
            )
            : (
              <div
                class="speculate-button speculate-button-active speculate-button-no"
                onClick={() => open.value = "no"}
              >
                Speculate No
                <small>To win $100.12</small>
              </div>
            )}
        </>
      )}

      {openId.value !== id && (
        <>
          <div class="market-label-wrapper">
            <div class="market-label">
              {market.label}
            </div>
          </div>
          <div class="proportions">
            <div
              class={market.betYesPercent >= 50
                ? "proportions-yes proportions-yes-active"
                : "proportions-yes proportions-yes-inactive"}
              style={{
                width: `${market.betYesPercent}%`,
              }}
            >
              {market.betYesPercent >= 20 && (
                <>
                  {market.betYesPercent}%
                </>
              )}
            </div>
            <div
              class={market.betYesPercent >= 50
                ? "proportions-no proportions-no-inactive"
                : "proportions-no proportions-no-active"}
              style={{
                width: `${100 - market.betYesPercent}%`,
              }}
            >
              {market.betYesPercent <= 80 && (
                <>
                  {100 - market.betYesPercent}%
                </>
              )}
            </div>
          </div>
          <div class="info">
            <small>
              Volume: {formatCurrencyShort(Math.random() * 100_000)}
            </small>
            <small>
              End:{" "}
              {new Date(market.endTime).toDateString().split(" ").slice(1).join(
                " ",
              )}
            </small>
          </div>
          <div>
            <div class="speculate-buttons">
              <div
                class="speculate-button speculate-button-yes"
                onClick={() => {
                  openId.value = id;
                  open.value = "yes";
                }}
              >
                Yes
              </div>
              <div
                class="speculate-button speculate-button-no"
                onClick={() => {
                  openId.value = id;
                  open.value = "no";
                }}
              >
                No
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
