export const PROD = true;
export const SORITES_CONTRACT_ADDRESS = PROD
  ? "0x58FF788dF84005B557e73E78CcC6F71456f332e9"
  : "0x65276bf7cB7F60392bd1eeA2c2d59BB184e21F26";

export const CHAIN_ID = PROD ? 8453n : 84532n;

export const USDC_PROXY_ADDRESS = PROD
  ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  : "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const USDC_IMPL_ADDRESS = PROD
  ? "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
  : "0xd74cc5d436923b8ba2c179b4bCA2841D8A52C5B5";
