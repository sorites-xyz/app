export type Market = {
  id: string;

  label: string;
  tags: string[];

  totalAmount: number;
  betYesPercent: number;

  endTime: number;
  // token: string;
  // metric: "price";
  // compareTime: string;
  // compareOperator: "le" | "gte";
};

export type PortfolioItem = {
  tokenId: string;
  label: string;

  outcome: "yes" | "no";

  totalUSDC: number;
  totalTokens: number;
  heldTokens: number;

  endTime: number;
  status: "open" | "won" | "lost";
};
