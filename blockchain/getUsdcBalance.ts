import { Contract } from "npm:ethers";
import { ethersProvider } from "./basic/ethers.ts";
import { USDC_IMPL_ADDRESS, USDC_PROXY_ADDRESS } from "../constants.ts";

let usdcContract: Contract | Promise<Contract> | null = null;

export async function getUsdcContract() {
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

  return usdcContract!;
}

// TODO: cache
export async function getUsdcBalance(address: string) {
  const usdcContract = await getUsdcContract();
  const balance = await usdcContract!.balanceOf(address);
  const decimals = await usdcContract!.decimals();
  const usdc = Number(balance) / (10 ** Number(decimals));

  return usdc;
}

export async function getUsdcAllowance(owner: string, spender: string) {
  const usdcContract = await getUsdcContract();
  const allowance = await usdcContract!.allowance(owner, spender);
  const decimals = await usdcContract!.decimals();
  const usdc = Number(allowance) / (10 ** Number(decimals));

  return BigInt(Math.floor(usdc));
}
