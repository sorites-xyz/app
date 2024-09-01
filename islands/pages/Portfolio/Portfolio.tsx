import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";
import { PortfolioItem } from "../../../types.ts";
import { Button } from "../../components/Button/Button.tsx";
import { signal, computed } from '@preact/signals';

const portfolioItems: PortfolioItem[] = [
  {
    tokenId: "0",
    label: "ETH Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 200,
    heldTokens: 100,
    totalUSDC: 1000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "2",
    label: "DOGE Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 3000,
    heldTokens: 200,
    totalUSDC: 7000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "1",
    label: "BTC Market Cap to reach $1bn on September 24th 2024.",
    outcome: "no",
    totalTokens: 4000,
    heldTokens: 50,
    totalUSDC: 5000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "3",
    label: "SOL Market Cap to reach $1bn on September 24th 2024.",
    outcome: "no",
    totalTokens: 500,
    heldTokens: 10,
    totalUSDC: 2000,
    status: "won",
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "4",
    label: "ADA Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 400,
    heldTokens: 300,
    totalUSDC: 2000,
    status: "lost",
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

const sortOrder = signal({
  tokens: 'asc',
  standingToWin: 'asc',
  status: 'asc'
});

let lastSortedColumn = 'tokens';

const handleSort = (column: 'tokens' | 'standingToWin') => {
  lastSortedColumn = column;
  sortOrder.value = {
    ...sortOrder.value,
    [column]: sortOrder.value[column] === 'asc' ? 'desc' : 'asc',
  };
};

const sortedData = computed(() => {
  const order = sortOrder.value;
  let sortedItems = portfolioItems.slice();

  if (lastSortedColumn === 'tokens') {
    sortedItems = sortedItems.sort((a, b) => {
      if (order.tokens === 'desc') {
        return b.heldTokens - a.heldTokens;
      } else {
        return a.heldTokens - b.heldTokens;
      }
    });
  } else if (lastSortedColumn === 'standingToWin') {
    sortedItems = sortedItems.sort((a, b) => {
      if (order.standingToWin === 'desc') {
        return (b.totalUSDC * b.heldTokens / b.totalTokens) - (a.totalUSDC * a.heldTokens / a.totalTokens);
      } else {
        return (a.totalUSDC * a.heldTokens / a.totalTokens) - (b.totalUSDC * b.heldTokens / b.totalTokens);
      }
    });
  }

  return sortedItems;
});
export function Portfolio() {
  return (
    <div class="container gap-container">
      <div class="text-button-row">
        <h1>Portfolio</h1>
        <Button label="Claim all" />
      </div>

      {portfolioItems.length === 0 && (
        <small>You haven't placed any speculations yet.</small>
      )}

      {portfolioItems.length > 0 && (
        <table>
          <tr>
            <th>Speculation</th>
            <th>
              <span 
                onClick={() => handleSort('tokens')}
                class={`sorted ${lastSortedColumn === 'tokens' ? 'active' : ''}`}
                >
                Tokens
                {sortOrder.value.tokens === 'asc' ? '\u2191' : '\u2193'}
              </span>
            </th>

            <th>
              <span
                onClick={() => handleSort('standingToWin')}
                class={`sorted ${lastSortedColumn === 'standingToWin' ? 'active' : ''}`}
                >
                Standing to win
                {sortOrder.value.standingToWin === 'asc' ? '\u2191' : '\u2193'}
              </span>
            </th>
            <th>Status</th>
          </tr>
          {sortedData.value.map((item) => (
            <tr
              class={`portfolio-row-${item.outcome}`}
            >
              <td>{item.label}</td>
              <td>{item.heldTokens} × {item.outcome.toUpperCase()}</td>
              <td>
                {formatCurrencyShort(
                  item.totalUSDC * item.heldTokens / item.totalTokens,
                )}
              </td>
              <td>
                {item.status === "open" && (
                  <div>
                    Resolving on{" "}
                    {new Date(item.endTime).toDateString().split(" ").slice(1)
                      .join(" ")}
                  </div>
                )}
                {item.status === "won" && (
                  <div class="portfolio-button portfolio-button-won">
                    Won - Collect USDC
                  </div>
                )}
                {item.status === "lost" && (
                  <div class="portfolio-button portfolio-button-lost">
                    Lost - Burn Tokens
                  </div>
                )}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
