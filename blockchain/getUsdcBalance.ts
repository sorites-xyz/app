import { Contract } from "npm:ethers";
import { ethersProvider } from "./basic/ethers.ts";
import { USDC_IMPL_ADDRESS, USDC_PROXY_ADDRESS } from "../constants.ts";

let usdcContract: Contract | Promise<Contract> | null = null;

// TODO: cache
export async function getUsdcBalance(address: string) {
  const usdcProxyAddress = USDC_PROXY_ADDRESS;
  const usdcImplementationAddress = USDC_IMPL_ADDRESS;

  if (usdcContract === null) {
    usdcContract = await new Promise(async (resolve) => {
      const { abi } = await fetch(`/api/v1/abi/${usdcImplementationAddress}`)
        .then((res) => res.json());
      console.log({ usdcProxyAddress, abi, ethersProvider });
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
