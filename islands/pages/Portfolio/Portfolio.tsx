import { demoGlobals } from "../../../blockchain/demoGlobals.ts";
import { Button } from "../../components/Button/Button.tsx";
import { Tag } from "../../components/Tag/Tag.tsx";
import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";

export function Portfolio() {
  const portfolioItems = demoGlobals.value.portfolioItems;

  return (
    <div class="container gap-container">
      <div class="text-button-row">
        <h1>Portfolio</h1>
        <Button label="Claim all" />
      </div>

      {portfolioItems.length === 0 && (
        <div class="empty-box">You haven't placed any speculations yet.</div>
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
