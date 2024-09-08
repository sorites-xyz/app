import { signal, useSignal, useSignalEffect } from "@preact/signals";
import { SORITES_CONTRACT_ADDRESS } from "../../constants.ts";
import { getContract } from "../contract/getContract.ts";
import { Contract } from "npm:ethers";

export type Sorites = {
  soritesContract: Contract;
  futureProviders: {
    contract: Contract;
    contractAddress: string;
    label: string;
    assets: string[];
    metrics: {
      metricId: number;
      name: string;
      valueLabels: string[];
    }[];
  }[];
};

const sorites = signal<Sorites | null>(null);

let promise: Promise<void> | null = null;

async function loadSorites() {
  const soritesContract = await getContract({
    implAddress: SORITES_CONTRACT_ADDRESS,
    abiUrl:
      "https://raw.githubusercontent.com/sorites-xyz/contract/master/bin/Sorites.abi",
  });

  const futuresAddresses = await soritesContract
    .getFuturesContractWhitelistAddresses();

  const futureProviders = await Promise.all(
    futuresAddresses.map(async (address: string) => {
      const futuresContract = await getContract({
        implAddress: address,
        abiUrl:
          "https://raw.githubusercontent.com/sorites-xyz/contract/master/bin/IFuturesProvider.abi",
      });

      const [label, assets, metrics] = await Promise.all([
        futuresContract.getLabel(),
        futuresContract.getSupportedAssets(),
        futuresContract.getSupportedMetrics(),
      ]);

      return {
        contract: futuresContract,
        contractAddress: address,
        label,
        assets,
        metrics,
      };
    }),
  );

  sorites.value = {
    soritesContract,
    futureProviders,
  };

  console.log("Sorites loaded");
}

export function useSorites() {
  const loading = useSignal<boolean>(true);

  useSignalEffect(() => {
    if (!promise) {
      promise = loadSorites();
    }

    promise.then(() => {
      loading.value = false;
    });
  });

  return sorites;
}
