import { useSignal } from "@preact/signals";
import { ContractProps } from "./types.ts";
import { Contract } from "npm:ethers";
import { useEffect } from "preact/hooks";
import { getContract } from "./getContract.ts";

export function useContract(props: ContractProps) {
  const contract = useSignal<Contract | null>(null);

  useEffect(() => {
    getContract(props).then((result) => {
      contract.value = result;
    });
  }, [props]);

  return contract;
}
