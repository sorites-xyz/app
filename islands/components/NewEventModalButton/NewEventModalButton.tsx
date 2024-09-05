import {
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { ModalButton } from "../ModalButton/ModalButton.tsx";
import { Button } from "../Button/Button.tsx";
import { SelectInput } from "../SelectInput/SelectInput.tsx";
import { TextInput } from "../TextInput/TextInput.tsx";
import { Sorites } from "../../../blockchain/hooks/useSorites.ts";
import { getBrowserProvider } from "../../../blockchain/basic/providers.ts";
import { useWallet } from "../../../blockchain/hooks/useWallet.ts";
import { CHAIN_ID } from "../../../constants.ts";

type NewEventModalButtonProps = {
  sorites: Signal<Sorites | null>;
};

export function NewEventModalButton({ sorites }: NewEventModalButtonProps) {
  const wallet = useWallet();
  const open = useSignal(false);

  const futuresContractAddress = useSignal<string | null>(null);
  const metric = useSignal<string | null>(null);
  const asset = useSignal<string | null>(null);
  const values = useSignal<string[]>([]);
  const resolvesAt = useSignal<string | null>(null);
  const expectedOutcome = useSignal<string>("yes");
  const speculationAmount = useSignal<string | null>(null);

  const previewText = useSignal<string | null>(null);

  const allFilledOut = useComputed(() => {
    return futuresContractAddress.value && metric.value && asset.value &&
      values.value.length > 0 && values.value.every((v) => v.length > 0) &&
      resolvesAt.value && expectedOutcome.value && speculationAmount.value;
  });

  async function createMarketEvent() {
    if (!allFilledOut.value) return;

    /*
      string calldata asset,
      uint8 metric,
      int80[] calldata values,
      uint64 endTime,
      uint80 usdcToDeposit,
      bool speculatingOnYes
    */
    const tx = await futuresProvider.contract.getFunction("createMarketEvent")
      .populateTransaction(
        asset.value,
        Number(metric.value),
        values.value.map((v) => BigInt(v)),
        new Date(resolvesAt.value!).getTime(),
        BigInt(speculationAmount.value!),
        expectedOutcome.value === "yes",
      );

    const provider = getBrowserProvider()!;
    const network = await provider.getNetwork();

    if (network.chainId !== CHAIN_ID) {
      alert("Please switch to Base to create a Market Event.");
      return;
    }

    const res = await provider.send("eth_sendTransaction", [{
      from: wallet.connections.value.currentAddress,
      to: futuresProvider.contractAddress,
      data: tx.data,
    }]);
    console.log(res);
  }

  // TODO: show preview of what the market event will be called
  // useSignalEffect(() => {
  //   if (allFilledOut.value) {
  //   }
  // });

  if (!sorites.value) {
    return null;
  }

  if (futuresContractAddress.value === null) {
    futuresContractAddress.value =
      sorites.value.futureProviders[0].contractAddress;
  }

  if (futuresContractAddress.value && metric.value === null) {
    metric.value = sorites.value.futureProviders
      .find((p) => p.contractAddress === futuresContractAddress.value)!
      .metrics[0].metricId.toString();
  }

  const futuresProvider = sorites.value.futureProviders.find(
    (p) => p.contractAddress === futuresContractAddress.value,
  )!;

  const futuresProviderMetric = futuresProvider?.metrics.find(
    (m) => m.metricId.toString() === metric.value,
  )!;

  return (
    <ModalButton
      open={open}
      buttonContent={<Button label="New Event" />}
      modalContent={
        <div class="NewEventModalButton__content_wrapper">
          <h2>Create a Market Event</h2>
          <small>Market events are what you can speculate on.</small>

          <SelectInput
            label="Event type"
            value={futuresContractAddress.value ?? ""}
            onChange={(x) => futuresContractAddress.value = x}
            options={sorites.value.futureProviders.map((p) => ({
              label: p.label,
              value: p.contractAddress,
            }))}
          />

          {futuresContractAddress.value && (
            <>
              <SelectInput
                label="Asset"
                onChange={(x) => asset.value = x}
                value={asset.value ?? ""}
                options={futuresProvider.assets.map((asset) => ({
                  label: asset,
                  value: asset,
                }))}
              />

              <SelectInput
                label="Metric"
                onChange={(x) => metric.value = x}
                value={metric.value ?? ""}
                options={futuresProvider.metrics.map((m) => ({
                  label: m.name,
                  value: m.metricId.toString(),
                }))}
              />

              {futuresProviderMetric?.valueLabels.map((label, i) => (
                <TextInput
                  label={label}
                  value={values.value[i] ?? ""}
                  onChange={(x) => {
                    const newValues = [...values.value];
                    newValues[i] = x;
                    values.value = newValues;
                  }}
                />
              ))}

              <TextInput
                label="Resolves at"
                value={resolvesAt.value ?? ""}
                onChange={(x) => resolvesAt.value = x}
              />

              {previewText.value && (
                <small>
                  The Market Event will be called <b>"{previewText.value}"</b>
                </small>
              )}

              <small>
                To create a Market Event, you must speculate on it with at least
                25 USDC.
              </small>

              <SelectInput
                label="Your expected outcome"
                onChange={(x) => expectedOutcome.value = x}
                value={expectedOutcome.value ?? "no"}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />

              <TextInput
                label="Speculation amount"
                onChange={(x) => speculationAmount.value = x}
                value={speculationAmount.value ?? ""}
                before={<span>$</span>}
                after={<span>USDC</span>}
              />
            </>
          )}

          <Button
            label="Create Market Event"
            onClick={createMarketEvent}
            disabled={!allFilledOut.value}
          />
        </div>
      }
    />
  );
}
