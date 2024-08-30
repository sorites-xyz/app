export function formatAddress(address: string) {
  if (address.endsWith(".eth")) {
    return address;
  }

  return `${address.slice(0, 6)}…${address.slice(-5)}`;
}
