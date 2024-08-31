import { PageProps } from "$fresh/server.ts";

const abiCache = new Map<string, string>();

export async function handler(_req: Request, props: PageProps) {
  const apiKey = Deno.env.get("BASESCAN_API_KEY");
  if (!apiKey) {
    return Response.json({
      ok: false,
      error: "Internal problem. Please contact support.",
    });
  }

  if (abiCache.has(props.params.address)) {
    return Response.json({ ok: true, abi: abiCache.get(props.params.address) });
  }

  const response = await fetch(
    props.params.address === "Sorites"
      ? "https://raw.githubusercontent.com/sorites-xyz/contract/master/bin/contracts/Sorites.abi"
      : props.params.address === "IFuturesProvider"
      ? "https://raw.githubusercontent.com/sorites-xyz/contract/master/bin/interfaces/IFuturesProvider.abi"
      : `https://api.basescan.org/api?module=contract&action=getabi&address=${props.params.address}&apikey=${apiKey}`,
  );

  if (!response.ok) {
    return Response.json({ ok: false, error: "Failed to fetch ABI (1)" });
  }

  const body = await response.json();
  if (body.message !== "OK") {
    return Response.json({ ok: false, error: "Failed to fetch ABI (2)" });
  }

  const abi = JSON.parse(body.result);

  abiCache.set(props.params.address, abi);

  return Response.json({ ok: true, abi });
}
