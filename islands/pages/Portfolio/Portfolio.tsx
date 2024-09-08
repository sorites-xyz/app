import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";
import { PortfolioItem } from "../../../types.ts";
import { Button } from "../../components/Button/Button.tsx";
import { signal, useComputed } from "@preact/signals";
import { Tag } from "../../components/Tag/Tag.tsx";
import { usePortfolioItems } from "../../../blockchain/hooks/usePortfolioItems.ts";

type ColumnName = "tokens" | "standingToWin";

const sortingFunctions: Record<
  ColumnName,
  (a: PortfolioItem, b: PortfolioItem) => number
> = {
  tokens: (a, b) => a.heldTokens - b.heldTokens,
  standingToWin: (a, b) =>
    (calculateStandingToWin(a)) - (calculateStandingToWin(b)),
};

const sortOrder = signal({
  column: "tokens" as ColumnName,
  direction: "asc",
});

const handleSort = (column: ColumnName) => {
  if (sortOrder.value.column === column) {
    sortOrder.value = {
      ...sortOrder.value,
      direction: sortOrder.value.direction === "asc" ? "desc" : "asc",
    };
  } else {
    sortOrder.value = {
      column,
      direction: "asc",
    };
  }
};

const calculateStandingToWin = (item: PortfolioItem) => {
  return item.totalUSDC * item.heldTokens / item.totalTokens;
};

export function Portfolio() {
  const portfolioItems = usePortfolioItems();

  const canClaim = useComputed(() => {
    return portfolioItems.value.some((item) => item.status !== "open");
  });

  const sortedData = useComputed(() => {
    const { column, direction } = sortOrder.value;
    let sortedItems = portfolioItems.value.slice();

    sortedItems = sortedItems.sort((a, b) => {
      const sortingFunction = sortingFunctions[column];
      const result = sortingFunction(a, b);
      return direction === "desc" ? -result : result;
    });

    return sortedItems;
  });
  return (
    <div class="container gap-container">
      <div class="text-button-row">
        <h1>Portfolio</h1>
        <Button label="Claim all" disabled={!canClaim.value} />
      </div>

      {portfolioItems.value.length === 0 && (
        <div class="empty-box">You haven't placed any speculations yet.</div>
      )}

      {portfolioItems.value.length > 0 && (
        <table>
          <tr>
            <th>Speculation</th>
            <th>
              <div class="column_header">
                <span
                  onClick={() => handleSort("tokens")}
                  class={`sorted ${
                    sortOrder.value.column === "tokens" ? "active" : ""
                  }`}
                >
                  Tokens
                  {sortOrder.value.column === "tokens"
                    ? (sortOrder.value.direction === "asc"
                      ? <img src="/caret-down.png" class="caret caret-down" />
                      : <img src="/caret-down.png" class="caret caret-up" />)
                    : (
                      <img
                        src="/caret-down.png"
                        class={"caret caret-down caret-disabled"}
                      />
                    )}
                </span>
              </div>
            </th>

            <th>
              <div class="column_header">
                <span
                  onClick={() => handleSort("standingToWin")}
                  class={`sorted ${
                    sortOrder.value.column === "standingToWin" ? "active" : ""
                  }`}
                >
                  To win
                  {sortOrder.value.column === "standingToWin"
                    ? (sortOrder.value.direction === "asc"
                      ? <img src="/caret-down.png" class="caret caret-down" />
                      : <img src="/caret-down.png" class="caret caret-up" />)
                    : (
                      <img
                        src="/caret-down.png"
                        class={"caret caret-down caret-disabled"}
                      />
                    )}
                </span>
              </div>
            </th>
            <th>Status</th>
          </tr>
          {sortedData.value.map((item) => (
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
                {formatCurrencyShort(calculateStandingToWin(item))}
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
