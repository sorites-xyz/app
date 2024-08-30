import { useMemo } from "preact/hooks";
import makeBlockie from "npm:ethereum-blockies-base64";

type AvatarProps = {
  address: string;
  [key: string]: unknown;
};

export function Avatar({ address, ...rest }: AvatarProps) {
  const imageSource = useMemo(() => makeBlockie(address), [address]);

  return <img {...rest} src={imageSource} />;
}
