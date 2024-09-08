import { useId } from "preact/hooks";
import { ComponentChildren } from "preact";

type TextInputProps = {
  type?: "text" | "date";
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  before?: ComponentChildren;
  after?: ComponentChildren;
};

export function TextInput(
  { type, label, value, onChange, placeholder, before, after }: TextInputProps,
) {
  const id = useId();

  return (
    <div class="TextInput__wrapper">
      {label && <label for={id}>{label}</label>}
      <div class="TextInput__content">
        {before}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          {...(type === "date"
            ? {
              min: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            }
            : {})}
        />
        {after}
      </div>
    </div>
  );
}
