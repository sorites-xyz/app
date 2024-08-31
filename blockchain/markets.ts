import { Contract } from "npm:ethers";
import { ethersProvider } from "./basic/ethers.ts";
import { SORITES_CONTRACT_ADDRESS } from "../constants.ts";

const soritesContractABI = await fetch("/api/v1/abi/Sorites").then((
  res,
) => res.json());

export const soritesContract = new Contract(
  SORITES_CONTRACT_ADDRESS,
  soritesContractABI,
  ethersProvider,
);

const futuresContracts: Record<string, Contract | Promise<Contract>> = {};
