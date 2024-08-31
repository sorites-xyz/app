export type ConnectionsData = {
  loaded: boolean;
  addresses: {
    providerName: string;
    address: string;
  }[];
  currentAddress: string | null;
};
