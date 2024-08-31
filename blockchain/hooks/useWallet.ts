import { effect, signal, useSignalEffect } from "@preact/signals";
import { ConnectionsData } from "../types.ts";

const STORAGE_KEY = "wallets8";

const connections = signal<ConnectionsData>({
  loaded: false,
  addresses: [],
  currentAddress: null,
});

effect(() => {
  if ("localStorage" in globalThis && connections.value.loaded) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections.value));
  }
});

export function useWallet() {
  useSignalEffect(() => {
    if ("localStorage" in globalThis && !connections.value.loaded) {
      const data = globalThis.localStorage.getItem(STORAGE_KEY);

      if (data) {
        console.log("Loading connections from localStorage");
        connections.value = JSON.parse(data);
      }

      connections.value.loaded = true;
    }
  });

  return {
    connections,
  };
}
