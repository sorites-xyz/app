import { Contract } from "npm:ethers";
import { ethersProvider } from "./basic/ethers.ts";

let usdcContract: Contract | Promise<Contract> | null = null;

// TODO: cache
export async function getUsdcBalance(address: string) {
  const usdcProxyAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const usdcImplementationAddress =
    "0x2ce6311ddae708829bc0784c967b7d77d19fd779";

  if (usdcContract === null) {
    usdcContract = await new Promise(async (resolve) => {
      const { abi } = await fetch(`/api/v1/abi/${usdcImplementationAddress}`)
        .then((res) => res.json());
      const contract = new Contract(usdcProxyAddress, abi, ethersProvider);
      resolve(contract);
    });
  }

  if (usdcContract instanceof Promise) {
    usdcContract = await usdcContract;
  }

  const balance = await usdcContract!.balanceOf(address);
  const decimals = await usdcContract!.decimals();
  const usdc = Number(balance) / (10 ** Number(decimals));

  return usdc;
}
