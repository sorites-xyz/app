import { ComponentChildren } from "preact";

type TagProps = {
  type: "red" | "green";
  children: ComponentChildren;
};

export function Tag({ type, children }: TagProps) {
  return <div class={`TagComponent ${type}`}>{children}</div>;
}
