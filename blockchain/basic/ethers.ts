import { JsonRpcProvider } from "npm:ethers";
import { PROD } from "../../constants.ts";

// TODO: set up a high volume provider
export const ethersProvider = new JsonRpcProvider(
  PROD ? "https://mainnet.base.org" : "https://sepolia.base.org/",
);
