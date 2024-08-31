import { useSignal } from "@preact/signals";
import { ModalButton } from "../ModalButton/ModalButton.tsx";
import { Button } from "../Button/Button.tsx";
import { SelectInput } from "../SelectInput/SelectInput.tsx";
import { TextInput } from "../TextInput/TextInput.tsx";

export function NewEventModalButton() {
  const open = useSignal(false);

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
            onChange={() => {}}
            value="test"
            options={[
              { label: "Price on a future day", value: "test" },
            ]}
          />

          <SelectInput
            label="Metric"
            onChange={() => {}}
            value="test"
            options={[
              { label: "Price is less than", value: "test" },
            ]}
          />

          <SelectInput
            label="Asset"
            onChange={() => {}}
            value="test"
            options={[
              { label: "ETH", value: "test" },
            ]}
          />

          <TextInput
            label="Value"
            value="4000"
            placeholder="1000"
            onChange={() => {}}
          />

          <TextInput
            label="Resolves at"
            value="2025-01-01"
            onChange={() => {}}
          />

          <small>
            The Market Event will be called{" "}
            <b>"Price of ETH will be less than $4000 on January 1st 2025."</b>
          </small>

          <small>
            To create a Market Event, you must speculate on it with at least 25
            USDC.
          </small>

          <SelectInput
            label="Your expected outcome"
            onChange={() => {}}
            value="yes"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />

          <TextInput
            label="Speculation amount"
            onChange={() => {}}
            value="25"
            before={<span>$</span>}
            after={<span>USDC</span>}
          />

          <Button
            label="Create Market Event"
            onClick={() => {}}
          />
        </div>
      }
    />
  );
}
