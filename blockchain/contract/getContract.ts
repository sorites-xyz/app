import { Contract } from "npm:ethers";
import { ethersProvider } from "../basic/ethers.ts";
import { ContractProps } from "./types.ts";

const contracts = new Map<string, Contract | Promise<Contract>>();

export async function getContract(props: ContractProps): Promise<Contract> {
  const proxyAddress = props.proxyAddress ?? props.implAddress;
  const abiAddress = props.abiAddress ?? props.implAddress;
  const implAddress = props.implAddress;

  const key = JSON.stringify({ proxyAddress, abiAddress, implAddress });

  if (!contracts.has(key)) {
    const promise = new Promise<Contract>(async (resolve) => {
      const { abi } = await fetch(`/api/v1/abi/${abiAddress}`).then((res) =>
        res.json()
      );
      const contract = new Contract(proxyAddress, abi, ethersProvider);
      resolve(contract);
    });

    contracts.set(key, promise);
  }

  let contract = contracts.get(key);
  if (contract instanceof Promise) {
    contract = await contract;
    contracts.set(key, contract);
  }

  return contract!;
}
