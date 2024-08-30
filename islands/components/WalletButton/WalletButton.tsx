import { computed, signal, useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  connectWithProvider,
  discoverProviders,
  walletProviders,
} from "../../../wallet/providers.ts";
import { Avatar } from "../Avatar/Avatar.tsx";
import { ModalButton } from "../ModalButton/ModalButton.tsx";
import { getUsdcBalance } from "../../../wallet/ethers.ts";

const STORAGE_KEY = "wallets5";

const wallets = signal<
  {
    addresses: {
      providerName: string;
      address: string;
    }[];
    currentAddress: string | null;
  }
>(
  globalThis.localStorage && globalThis.localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY)!)
    : {
      addresses: [],
      currentAddress: null,
    },
);

function formatAddress(address: string) {
  if (address.endsWith(".eth")) {
    return address;
  }

  return `${address.slice(0, 6)}…${address.slice(-5)}`;
}

export function WalletButton() {
  const providersExist = Object.values(walletProviders.value).length > 0;
  const connectModalOpen = useSignal(false);
  const buttonShown = useSignal(false);

  const usdcBalances = useSignal<Record<string, number>>({});
  const usdcBalance = computed(() => {
    return Object.values(usdcBalances.value).reduce((a, b) => a + b, 0);
  });

  useSignalEffect(() => {
    wallets.value.addresses.forEach(({ address }) => {
      getUsdcBalance(address).then((balance) => {
        usdcBalances.value = {
          ...usdcBalances.value,
          [address]: balance,
        };
      });
    });
  });

  useEffect(() => {
    discoverProviders();
    buttonShown.value = true;
  }, []);

  async function connectWallet(
    providerName: string,
    detail: EIP6963AnnounceProviderEvent["detail"],
  ) {
    const addresses = await connectWithProvider(detail);

    for (const address of addresses) {
      if (wallets.value.addresses.some((x) => x.address === address)) {
        continue;
      }

      wallets.value.addresses.push({ providerName, address });
    }

    if (!wallets.value.currentAddress) {
      wallets.value.currentAddress = addresses[0] ?? null;
    }

    if (addresses.length > 0) {
      connectModalOpen.value = false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets.value));
  }

  // Server side rendering
  if (!("document" in globalThis)) {
    return <div class="WalletButton WalletButton__faded"></div>;
  }

  return (
    <div class="WalletButton">
      <ModalButton
        buttonContent={
          <>
            {wallets.value.currentAddress !== null && (
              <div class="WalletButton__account_button">
                <Avatar
                  address={wallets.value.currentAddress}
                  class="WalletButton__avatar"
                />
                <div class="WalletButton__account_button_address">
                  {usdcBalance.value.toFixed(2)} USDC
                </div>
              </div>
            )}

            {(wallets.value.currentAddress === null) && (
              <div class="connect-wallet">
                Connect Wallet
              </div>
            )}
          </>
        }
        modalContent={
          <>
            {wallets.value.addresses.length > 0 && (
              <>
                <h2>Addresses</h2>
                <div>
                  {wallets.value.addresses.map((address) => (
                    <div class="WalletButton__wallet_address">
                      <Avatar address={address.address} />
                      <div class="address">
                        {formatAddress(address.address)}
                      </div>
                      <div class="WalletButton__wallet_address__balance">
                        {(usdcBalances.value[address.address] ?? 0).toFixed(2)}
                        {" "}
                        USDC
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2>
              {wallets.value.addresses.length > 0
                ? "Wallets"
                : "Connect Wallet"}
            </h2>
            <div>
              {!providersExist && (
                <div class="info">
                  No wallet providers detected. Install your wallet's browser
                  extension.
                  <br />
                  <br />We suggest{" "}
                  <a href="https://metamask.io/download/" target="_blank">
                    MetaMask
                  </a>.
                </div>
              )}

              {providersExist &&
                Object.values(walletProviders.value).map((provider) => {
                  const connected = wallets.value.addresses.some(
                    (x) => x.providerName === provider.name,
                  );

                  return (
                    <div
                      class={connected
                        ? "wallet-option-button"
                        : "wallet-option-button"}
                      onClick={() =>
                        connectWallet(provider.name, provider.detail)}
                    >
                      <div>
                        <img src={provider.iconUrl} alt={provider.name} />
                        {provider.name}
                      </div>
                      <div class="wallet-option-button-pill">
                        {connected ? "Connected" : "Connect"}
                      </div>
                    </div>
                  );
                })}
            </div>
            {providersExist && (
              <>
                <div class="sep-h" />
                <small class="info">
                  If you don't see the wallet you're looking for, install the
                  wallet's browser extension.
                </small>
              </>
            )}
          </>
        }
        open={connectModalOpen}
      />
    </div>
  );
}
