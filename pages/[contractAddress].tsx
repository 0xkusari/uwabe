import {
  ContractFunction,
  ContractFunctionItem,
} from "@/components/ContractFunctionItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MetaMaskSDK from "@metamask/sdk";

export default function ContractAddress() {
  const router = useRouter();
  const { contractAddress } = router.query;
  const [contractFunctions, setContractFunctions] = useState<[] | null>(null);

  // const MMSDK = new MetaMaskSDK();
  // // const ethereum = MMSDK.getProvider();
  // ethereum.request({ method: 'eth_requestAccounts', params: [] });

  useEffect(() => {
    if (contractAddress) {
      fetchContractData(contractAddress as string);
    }
  }, [contractAddress]);

  const fetchContractData = async (address: string) => {
    const response = await fetch(`/api/contract?address=${address}`);
    const data = await response.json();
    if (data.status === "1") {
      const results = JSON.parse(data.result);
      const functions = results.filter(
        (result: any) => result.type === "function"
      );

      const mapper = (func: any): ContractFunction => {
        return {
          name: func.name,
          inputs: func.inputs,
          outputs: func.outputs,
          readonly:
            func.stateMutability === "view" || func.stateMutability === "pure",
        };
      };

      setContractFunctions(functions.map(mapper));
    }
  };

  return (
    <>
      <button>Connect to wallet</button>
      <div className="min-h-screen flex items-center justify-center">
        {contractFunctions ? (
          <ul>
            {contractFunctions.map((contractFunction: ContractFunction) => (
              <li
                key={`${contractFunction.name}_${contractFunction.inputs.length}_${contractFunction.outputs.length}_${contractFunction.readonly}`}
              >
                <ContractFunctionItem {...contractFunction} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
