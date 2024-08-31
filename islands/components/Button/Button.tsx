type ButtonProps = {
  type?: "outlined" | "filled";
  label: string;
  onClick?: () => void;
};

export function Button({ type = "filled", label, onClick }: ButtonProps) {
  return <div class={`ButtonComponent ${type}`} onClick={onClick}>{label}</div>;
}
