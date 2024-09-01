import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";
import { PortfolioItem } from "../../../types.ts";
import { Button } from "../../components/Button/Button.tsx";
import { Tag } from "../../components/Tag/Tag.tsx";

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
            <th>Event</th>
            <th>Tokens</th>
            <th>To win</th>
            <th>Status</th>
          </tr>
          {portfolioItems.map((item) => (
            <tr
              class={`portfolio-row-${item.outcome}`}
            >
              <td>
                {item.label} {item.outcome === "yes"
                  ? <Tag type="green">Yes</Tag>
                  : <Tag type="red">No</Tag>}
              </td>
              <td>{item.heldTokens}</td>
              <td>
                {formatCurrencyShort(
                  item.totalUSDC * item.heldTokens / item.totalTokens,
                )}
              </td>
              <td>
                {item.status === "open" && <div>Pending</div>}
                {item.status === "won" && <div>Won</div>}
                {item.status === "won_claimed" && <div>Claimed</div>}
                {item.status === "lost" && <div>Lost</div>}
                {item.status === "lost_burned" && <div>Burned</div>}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
