import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";
import { PortfolioItem } from "../../../types.ts";
import { Button } from "../../components/Button/Button.tsx";

const portfolioItems: PortfolioItem[] = [
  {
    tokenId: "0",
    label: "ETH Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 400,
    heldTokens: 100,
    totalUSDC: 2000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "2",
    label: "DOGE Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 400,
    heldTokens: 100,
    totalUSDC: 2000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "1",
    label: "BTC Market Cap to reach $1bn on September 24th 2024.",
    outcome: "no",
    totalTokens: 400,
    heldTokens: 100,
    totalUSDC: 2000,
    status: "open",
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "3",
    label: "SOL Market Cap to reach $1bn on September 24th 2024.",
    outcome: "no",
    totalTokens: 400,
    heldTokens: 100,
    totalUSDC: 2000,
    status: "won",
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    tokenId: "4",
    label: "ADA Market Cap to reach $2bn on September 24th 2024.",
    outcome: "yes",
    totalTokens: 400,
    heldTokens: 100,
    totalUSDC: 2000,
    status: "lost",
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

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
            <th>Tokens</th>
            <th>Standing to win</th>
            <th>Status</th>
          </tr>
          {portfolioItems.map((item) => (
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
