import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  connectWithProvider,
  discoverProviders,
  walletProviders,
} from "../../../wallet/providers.ts";
import { useWallet } from "../../../wallet/useWallet.ts";
import { Avatar } from "../Avatar/Avatar.tsx";
import { ModalButton } from "../ModalButton/ModalButton.tsx";
import { formatAddress } from "../../../wallet/formatAddress.ts";

export function WalletButton() {
  const { connections } = useWallet();

  const providersExist = Object.values(walletProviders.value).length > 0;
  const connectModalOpen = useSignal(false);
  const buttonShown = useSignal(false);

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
      if (connections.value.addresses.some((x) => x.address === address)) {
        continue;
      }

      connections.value.addresses.push({ providerName, address });
    }

    if (connections.value.currentAddress) {
      connections.value.currentAddress = addresses[0];
    }

    connections.value = { ...connections.value };
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
            {connections.value.currentAddress !== null && (
              <div class="WalletButton__account_button">
                <Avatar
                  address={connections.value.currentAddress}
                  class="WalletButton__avatar"
                />
                {connections.value.currentAddress &&
                  formatAddress(connections.value.currentAddress)}
              </div>
            )}

            {(connections.value.currentAddress === null) && (
              <div class="connect-wallet">
                Connect Wallet
              </div>
            )}
          </>
        }
        modalContent={
          <>
            {connections.value.addresses.length > 0 && (
              <>
                <h2>Addresses</h2>
                <div class="WalletButton__wallet_address_list">
                  {connections.value.addresses.map(({ address }) => (
                    <div
                      class={connections.value.currentAddress === address
                        ? "WalletButton__wallet_address disabled"
                        : "WalletButton__wallet_address"}
                      onClick={() => {
                        connections.value = {
                          ...connections.value,
                          currentAddress: address,
                        };
                      }}
                    >
                      <Avatar address={address} />
                      <div class="address">
                        {formatAddress(address)}
                      </div>
                      {connections.value.currentAddress === address
                        ? (
                          <div class="wallet-option-button-pill">
                            Current Address
                          </div>
                        )
                        : (
                          <div class="wallet-option-button-pill">
                            Select
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2>
              {connections.value.addresses.length > 0
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
                  const connected = connections.value.addresses.some(
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
                        {connected ? "Add accounts" : "Connect"}
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
