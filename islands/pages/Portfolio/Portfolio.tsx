import { formatCurrencyShort } from "../Markets/formatCurrencyShort.ts";
import { PortfolioItem } from "../../../types.ts";
import { Button } from "../../components/Button/Button.tsx";
import { signal, useComputed } from "@preact/signals";
import { Tag } from "../../components/Tag/Tag.tsx";

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
  const sortedData = useComputed(() => {
    const { column, direction } = sortOrder.value;
    let sortedItems = portfolioItems.slice();

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
