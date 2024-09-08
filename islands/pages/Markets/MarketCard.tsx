import { signal, useSignal } from "@preact/signals";
import { formatCurrencyShort } from "./formatCurrencyShort.ts";
import { Market } from "../../../types.ts";
import { useId } from "preact/hooks";
import { TextInput } from "../../components/TextInput/TextInput.tsx";
import { useSorites } from "../../../blockchain/hooks/useSorites.ts";
import {
  CHAIN_ID,
  SORITES_CONTRACT_ADDRESS,
  USDC_PROXY_ADDRESS,
} from "../../../constants.ts";
import { getBrowserProvider } from "../../../blockchain/basic/providers.ts";
import {
  getUsdcAllowance,
  getUsdcContract,
} from "../../../blockchain/getUsdcBalance.ts";
import { useWallet } from "../../../blockchain/hooks/useWallet.ts";

type MarketCardProps = {
  market: Market;
};

const openId = signal<string | null>(null);
const open = signal<"yes" | "no">("no");

export function MarketCard({ market }: MarketCardProps) {
  const id = useId();
  const sorites = useSorites();
  const wallet = useWallet();

  const speculationAmount = useSignal("100");

  async function speculate(speculatingOnYes: boolean) {
    const provider = getBrowserProvider()!;
    const network = await provider.getNetwork();

    if (network.chainId !== CHAIN_ID) {
      alert("Please switch to Base to create a Market Event.");
      return;
    }

    const usdcContract = await getUsdcContract();

    const usdcDecimalMultiplier = 10n **
      BigInt(await usdcContract.decimals());
    const speculationUsdc = BigInt(Number(speculationAmount.value!)) *
      usdcDecimalMultiplier;

    while (true) {
      const usdcAllowance = (await getUsdcAllowance(
        wallet.connections.value.currentAddress!,
        SORITES_CONTRACT_ADDRESS,
      )) * usdcDecimalMultiplier;

      if (usdcAllowance >= speculationUsdc) break;

      const approveTx = await usdcContract.getFunction("increaseAllowance")
        .populateTransaction(
          SORITES_CONTRACT_ADDRESS,
          speculationUsdc - usdcAllowance,
        );

      if (!approveTx) return;

      const approveRes = await provider.send("eth_sendTransaction", [{
        from: wallet.connections.value.currentAddress,
        to: USDC_PROXY_ADDRESS,
        data: approveTx.data,
      }]);

      // Wait for the transaction to be mined
      await new Promise<void>((resolve) => {
        const interval = setInterval(async () => {
          const receipt = await provider.send("eth_getTransactionReceipt", [
            approveRes,
          ]);

          console.log("receipt", receipt);

          if (receipt) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    const tx = await sorites.value!.soritesContract.getFunction(
      "mintMarketEventTokens",
    )
      .populateTransaction(
        BigInt(Number(market.id)),
        speculationUsdc,
        speculatingOnYes,
      );

    await provider.send("eth_sendTransaction", [{
      from: wallet.connections.value.currentAddress,
      to: SORITES_CONTRACT_ADDRESS,
      data: tx.data,
    }]);

    open.value = "no";
  }

  return (
    <div class={openId.value === id ? "market market-open" : "market"}>
      {openId.value === id && (
        <>
          <div class="market-label-wrapper">
            <div class="market-label">
              {market.label}
            </div>
            <div
              class="close"
              onClick={() => openId.value = null}
            >
              ✕
            </div>
          </div>

          <TextInput
            value={speculationAmount.value}
            onChange={(x) => {
              if (isNaN(Number(x)) || Number(x) < 0) {
                speculationAmount.value = "0";
              } else {
                speculationAmount.value = x;
              }
            }}
            placeholder="1000"
            before={<span>$</span>}
          />

          {open.value === "yes"
            ? (
              <div
                class="speculate-button speculate-button-active speculate-button-yes"
                onClick={() => speculate(true)}
              >
                Speculate Yes
                {/* <small>To win $100.12</small> */}
              </div>
            )
            : (
              <div
                class="speculate-button speculate-button-active speculate-button-no"
                onClick={() => speculate(false)}
              >
                Speculate No
                {/* <small>To win $100.12</small> */}
              </div>
            )}
        </>
      )}

      {openId.value !== id && (
        <>
          <div class="market-label-wrapper">
            <div class="market-label">
              {market.label}
            </div>
          </div>
          <div class="proportions">
            <div
              class={market.betYesPercent >= 50
                ? "proportions-yes proportions-yes-active"
                : "proportions-yes proportions-yes-inactive"}
              style={{
                width: `${market.betYesPercent}%`,
              }}
            >
              {market.betYesPercent >= 20 && (
                <>
                  {market.betYesPercent}%
                </>
              )}
            </div>
            <div
              class={market.betYesPercent >= 50
                ? "proportions-no proportions-no-inactive"
                : "proportions-no proportions-no-active"}
              style={{
                width: `${100 - market.betYesPercent}%`,
              }}
            >
              {market.betYesPercent <= 80 && (
                <>
                  {100 - market.betYesPercent}%
                </>
              )}
            </div>
          </div>
          <div class="info">
            <small>
              Volume: {formatCurrencyShort(market.totalAmount)}
            </small>
            <small>
              End:{" "}
              {new Date(market.endTime).toDateString().split(" ").slice(1).join(
                " ",
              )}
            </small>
          </div>
          <div>
            <div class="speculate-buttons">
              <div
                class="speculate-button speculate-button-yes"
                onClick={() => {
                  openId.value = id;
                  open.value = "yes";
                }}
              >
                Yes
              </div>
              <div
                class="speculate-button speculate-button-no"
                onClick={() => {
                  openId.value = id;
                  open.value = "no";
                }}
              >
                No
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
