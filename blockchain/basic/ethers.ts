import { JsonRpcProvider } from "npm:ethers";
import { PROD } from "../../constants.ts";

// TODO: set up a high volume provider
export const ethersProvider = new JsonRpcProvider(
  PROD
    ? "https://base-mainnet.g.alchemy.com/v2/5V6SNeeCTbU5uiZzhBD4wTxrvef2-agw"
    : "https://base-sepolia.g.alchemy.com/v2/5V6SNeeCTbU5uiZzhBD4wTxrvef2-agw",
);
