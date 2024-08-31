import { BrowserProvider } from "npm:ethers";
import { signal } from "@preact/signals";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }

  interface EIP6963ProviderInfo {
    rdns: string;
    uuid: string;
    name: string;
    icon: string;
  }

  interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo;
    provider: EIP1193Provider;
  }

  type EIP6963AnnounceProviderEvent = {
    detail: {
      info: EIP6963ProviderInfo;
      provider: Readonly<EIP1193Provider>;
    };
  };

  interface EIP1193Provider {
    isStatus?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (
      request: { method: string; params?: Array<unknown> },
      callback: (error: Error | null, response: unknown) => void,
    ) => void;
    send?: (
      request: { method: string; params?: Array<unknown> },
      callback: (error: Error | null, response: unknown) => void,
    ) => void;
    request: (request: {
      method: string;
      params?: Array<unknown>;
    }) => Promise<unknown>;
  }
}

let browserProvider: BrowserProvider | null = null;

export function getBrowserProvider() {
  return browserProvider;
}

// Connect to the selected provider using eth_requestAccounts.
export const connectWithProvider = async (
  wallet: EIP6963AnnounceProviderEvent["detail"],
): Promise<string[]> => {
  try {
    await wallet.provider.request({
      "method": "wallet_requestPermissions",
      "params": [
        {
          "eth_accounts": {},
        },
      ],
    });

    return await wallet.provider.request({
      method: "eth_requestAccounts",
    }) as string[];
  } catch (error) {
    console.error("Failed to connect to provider:", error);
    return [];
  }
};

export const walletProviders = signal(
  {} as Record<
    string,
    {
      name: string;
      iconUrl: string;
      detail: EIP6963AnnounceProviderEvent["detail"];
    }
  >,
);

export function discoverProviders() {
  globalThis.addEventListener(
    "eip6963:announceProvider",
    (event) => {
      if (event.detail.info.name in walletProviders.value) {
        return;
      }

      console.log("Detected provider:", event.detail.info.name);

      if (!browserProvider) {
        browserProvider = new BrowserProvider(event.detail.provider);
      }

      walletProviders.value = {
        ...walletProviders.value,

        [event.detail.info.name]: {
          name: event.detail.info.name,
          iconUrl: event.detail.info.icon,
          detail: event.detail,
        },
      };
    },
  );

  console.log("Requesting providers...");
  globalThis.dispatchEvent(new Event("eip6963:requestProvider"));
}
