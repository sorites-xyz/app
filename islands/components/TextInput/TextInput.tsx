import { useId } from "preact/hooks";
import { ComponentChildren } from "preact";

type TextInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  before?: ComponentChildren;
  after?: ComponentChildren;
};

export function TextInput(
  { label, value, onChange, placeholder, before, after }: TextInputProps,
) {
  const id = useId();

  return (
    <div class="TextInput__wrapper">
      {label && <label for={id}>{label}</label>}
      <div class="TextInput__content">
        {before}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
        />
        {after}
      </div>
    </div>
  );
}
