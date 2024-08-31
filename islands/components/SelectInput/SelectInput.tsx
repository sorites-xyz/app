import { useId } from "preact/hooks";

type SelectInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

export function SelectInput(
  { label, value, onChange, options }: SelectInputProps,
) {
  const id = useId();

  return (
    <div class="SelectInput__wrapper">
      {label && <label for={id}>{label}</label>}
      <div class="SelectInput__content">
        <select
          id={id}
          onChange={(e: any) => {
            onChange(e.target.value);
          }}
        >
          {options.map((option) => (
            <option value={option.value} selected={option.value === value}>
              {option.label}
            </option>
          ))}
        </select>
        <img src="/caret-down.png" class="SelectInput__caret" />
      </div>
    </div>
  );
}
