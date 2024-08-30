import { PageProps } from "$fresh/server.ts";
import { WalletButton } from "../../islands/components/WalletButton/WalletButton.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <div class="wrapper">
      <header>
        <div class="wide-container">
          <div class="row">
            <a class="logo-link" href="/">
              <img src="/logo-text.png" />
            </a>
          </div>

          <div class="row">
            <a class="link" href="/">Markets</a>
            <a class="link" href="/portfolio">Portfolio</a>
            <a class="link" target="_blank" href="https://docs.sorites.xyz/">
              Docs
            </a>
            <a
              class="link"
              target="_blank"
              href="https://github.com/sorites-xyz"
            >
              Github
            </a>
            <a
              class="link"
              target="_blank"
              href="https://discord.gg/sorites"
            >
              Discord
            </a>
          </div>

          <div class="row">
            <WalletButton />
          </div>
        </div>
      </header>
      <Component />
    </div>
  );
}
