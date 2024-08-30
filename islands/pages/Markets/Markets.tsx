import { MarketCard } from "./MarketCard.tsx";
import type { Market } from "../../../types.ts";
import { useSignal } from "@preact/signals";
import { Pills } from "../../components/Pills/Pills.tsx";

const markets: Market[] = [
  {
    "id": "0",
    "label": "ETH Market Cap to reach $2bn on September 24th 2024.",
    "tags": [
      "ETH",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "1",
    "label": "BTC Market Cap to reach $1bn on September 24th 2024.",
    "tags": [
      "BTC",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "2",
    "label": "DOGE Market Cap to reach $2bn on September 24th 2024.",
    "tags": [
      "DOGE",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "3",
    "label": "SOL Market Cap to reach $1bn on September 24th 2024.",
    "tags": [
      "SOL",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "4",
    "label": "ADA Market Cap to reach $2bn on September 24th 2024.",
    "tags": [
      "ADA",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "5",
    "label": "DOT Market Cap to reach $1bn on September 24th 2024.",
    "tags": [
      "DOT",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "6",
    "label": "UNI Market Cap to reach $2bn on September 24th 2024.",
    "tags": [
      "UNI",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "7",
    "label": "LINK Market Cap to reach $1bn on September 24th 2024.",
    "tags": [
      "LINK",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "8",
    "label": "LTC Market Cap to reach $2bn on September 24th 2024.",
    "tags": [
      "LTC",
      "Market Cap",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "9",
    "label": "ETH Price to reach $2,000 on September 24th 2024.",
    "tags": [
      "ETH",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "10",
    "label": "BTC Price to reach $1,000 on September 24th 2024.",
    "tags": [
      "BTC",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "11",
    "label": "DOGE Price to reach $2 on September 24th 2024.",
    "tags": [
      "DOGE",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "12",
    "label": "SOL Price to reach $100 on September 24th 2024.",
    "tags": [
      "SOL",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "13",
    "label": "ADA Price to reach $2 on September 24th 2024.",
    "tags": [
      "ADA",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "14",
    "label": "DOT Price to reach $100 on September 24th 2024.",
    "tags": [
      "DOT",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "15",
    "label": "UNI Price to reach $2 on September 24th 2024.",
    "tags": [
      "UNI",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "16",
    "label": "LINK Price to reach $100 on September 24th 2024.",
    "tags": [
      "LINK",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "17",
    "label": "LTC Price to reach $100 on September 24th 2024.",
    "tags": [
      "LTC",
      "Price",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "18",
    "label": "ETH Trading Volume to reach $2bn on September 24th 2024.",
    "tags": [
      "ETH",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "19",
    "label": "BTC Trading Volume to reach $1bn on September 24th 2024.",
    "tags": [
      "BTC",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "20",
    "label": "DOGE Trading Volume to reach $2bn on September 24th 2024.",
    "tags": [
      "DOGE",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "21",
    "label": "SOL Trading Volume to reach $1bn on September 24th 2024.",
    "tags": [
      "SOL",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "22",
    "label": "ADA Trading Volume to reach $2bn on September 24th 2024.",
    "tags": [
      "ADA",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "23",
    "label": "DOT Trading Volume to reach $1bn on September 24th 2024.",
    "tags": [
      "DOT",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "24",
    "label": "UNI Trading Volume to reach $2bn on September 24th 2024.",
    "tags": [
      "UNI",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "25",
    "label": "LINK Trading Volume to reach $1bn on September 24th 2024.",
    "tags": [
      "LINK",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
  {
    "id": "26",
    "label": "LTC Trading Volume to reach $2bn on September 24th 2024.",
    "tags": [
      "LTC",
      "Trading Volume",
    ],
    "endTime": Date.now() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000,
  },
].map((x) => ({
  ...x,
  "totalAmount": Math.floor(Math.random() * 1_000_000),
  betYesPercent: Math.floor(Math.random() * 100),
}));

export function Markets() {
  const tags = [...new Set(markets.flatMap((market) => market.tags))];
  const currentTag = useSignal<string | null>(null);

  const marketsToDisplay = currentTag.value
    ? markets.filter((market) => market.tags.includes(currentTag.value!))
    : markets;

  return (
    <div class="container gap-container">
      <h1>Markets</h1>

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
    </div>
  );
}
