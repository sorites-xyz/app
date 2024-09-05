type ButtonProps = {
  type?: "outlined" | "filled";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(
  { type = "filled", label, onClick, disabled }: ButtonProps,
) {
  return (
    <div
      class={`ButtonComponent ${type}${disabled ? " disabled" : ""}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
