import { SignalLike } from "$fresh/src/types.ts";
import { PillTick } from "./PillTick.tsx";

type PillsProps = {
  options: { label: string; value: string }[];
  selected: SignalLike<string | null>;
};

export function Pills({ options, selected }: PillsProps) {
  return (
    <div class="Pills">
      <div
        class={selected.value === null
          ? "Pills__pill Pills__pill__selected"
          : "Pills__pill"}
        onClick={() => selected.value = null}
      >
        {selected.value === null && <PillTick />}
        All
      </div>
      {options.map((option) => (
        <div
          onClick={() => {
            if (selected.value === option.value) {
              selected.value = null;
            } else {
              selected.value = option.value;
            }
          }}
          class={selected.value === option.value
            ? "Pills__pill Pills__pill__selected"
            : "Pills__pill"}
        >
          {selected.value === option.value && <PillTick />}
          {option.label}
        </div>
      ))}
    </div>
  );
}
